// Cuts [start, end] out of a video in the browser. It first tries to copy the
// encoded packets (no re-encoding: fast, same quality). That only works when a
// key frame sits close to `start`; otherwise the clip is re-encoded with a
// bitrate chosen so it fits in `maxSize`. Same when the copied clip is still
// bigger than `maxSize`.

// How far back (seconds) the copy may start to reach a key frame
const KEY_FRAME_TOLERANCE = 1.5
// Room left for audio and container overhead when picking a bitrate
const VIDEO_SHARE = 0.85
// Browser encoders overshoot the target bitrate, so re-encode a few times with
// a proportionally lower bitrate until the clip fits
const MAX_ENCODE_ATTEMPTS = 4

export const trimVideo = async (
  file: File,
  { start, end }: { start: number; end?: number },
  { maxSize, onProgress }: { maxSize: number; onProgress?: (progress: number) => void }
) => {
  // mediabunny is only needed when the user actually trims
  const mb = await import("mediabunny")

  const input = new mb.Input({ source: new mb.BlobSource(file), formats: mb.ALL_FORMATS })
  const audioTrack = await input.getPrimaryAudioTrack()
  // MP4 can hold almost everything except Vorbis audio (common in WebM)
  const isWebm = audioTrack?.codec === "vorbis"
  const duration = await input.computeDuration()
  const clipDuration = (end ?? duration) - start

  const convert = async (transcode: false | { bitrate: number }) => {
    const output = new mb.Output({
      format: isWebm
        ? new mb.WebMOutputFormat()
        : new mb.Mp4OutputFormat({ fastStart: "in-memory" }),
      target: new mb.BufferTarget(),
    })

    const conversion = await mb.Conversion.init({
      input,
      output,
      trim: { start, end },
      showWarnings: false,
      ...(transcode
        ? { video: { bitrate: Math.round(transcode.bitrate) } }
        : {
            copy: {
              mode: "forced",
              shiftTolerance: Infinity,
              boundaryPolicy: "expand",
              boundaryTolerance: KEY_FRAME_TOLERANCE,
            },
          }),
    })

    // In copy mode, tracks without a key frame close enough get discarded
    const cannotCopy = conversion.discardedTracks.some(
      (track) => track.reason === "cannot_copy"
    )
    if (!conversion.isValid || cannotCopy) {
      return null
    }

    conversion.onProgress = onProgress
    await conversion.execute()
    return output.target.buffer!
  }

  let buffer = await convert(false)

  const sourceBitrate = (file.size * 8) / duration
  let bitrate = Math.min(sourceBitrate, ((maxSize * 8) / clipDuration) * VIDEO_SHARE)

  for (let attempt = 0; attempt < MAX_ENCODE_ATTEMPTS; attempt++) {
    if (buffer && buffer.byteLength <= maxSize) break

    buffer = await convert({ bitrate })
    if (!buffer) break
    bitrate *= (maxSize / buffer.byteLength) * 0.9
  }

  if (buffer && buffer.byteLength > maxSize) {
    throw new Error("Não foi possível deixar o trecho abaixo do limite")
  }

  if (!buffer) {
    throw new Error("Formato de vídeo não suportado para corte")
  }

  const name = file.name.replace(/\.[^.]+$/, "") + (isWebm ? ".webm" : ".mp4")
  return new File([buffer], name, { type: isWebm ? "video/webm" : "video/mp4" })
}
