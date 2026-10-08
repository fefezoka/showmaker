import React, { useEffect, useRef, useState } from "react"
import * as Slider from "@radix-ui/react-slider"
import { IoPause, IoPlay, IoVolumeHigh, IoVolumeMute } from "react-icons/io5"
import { keyframes, styled } from "stitches.config"
import { Box } from "@/styles/box"
import { Flex } from "@/styles/flex"
import { Text } from "@/styles/text"

export interface TrimRange {
  start: number
  end: number
}

const FILMSTRIP_FRAMES = 10

const Glow = keyframes({
  "0%, 100%": { backgroundColor: "$bg3" },
  "50%": { backgroundColor: "$bg4" },
})
const TIMELINE_HEIGHT = 56

const SliderRoot = styled(Slider.Root, {
  position: "relative",
  display: "flex",
  alignItems: "center",
  userSelect: "none",
  touchAction: "none",
  width: "100%",
  height: TIMELINE_HEIGHT,
  "&[data-disabled]": { opacity: 0.6, pointerEvents: "none" },
})

const SliderTrack = styled(Slider.Track, {
  position: "relative",
  flexGrow: 1,
  height: "100%",
  br: "$3",
  overflow: "hidden",
  bc: "$bg3",
})

// The selected region: a frame around the filmstrip, no fill
const SliderRange = styled(Slider.Range, {
  position: "absolute",
  height: "100%",
  boxSizing: "border-box",
  borderTop: "3px solid $blue9",
  borderBottom: "3px solid $blue9",
})

const SliderThumb = styled(Slider.Thumb, {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 16,
  height: TIMELINE_HEIGHT,
  bc: "$blue9",
  cursor: "ew-resize",
  outline: "none",
  "&[aria-label='Início']": { borderRadius: "8px 0 0 8px" },
  "&[aria-label='Fim']": { borderRadius: "0 8px 8px 0" },
  "&:focus-visible": { bs: "0 0 0 2px white" },
  // grip
  "&::after": {
    content: "''",
    width: 3,
    height: 18,
    br: "$pill",
    bc: "rgba(255,255,255,.85)",
  },
})

const Dim = styled("div", {
  position: "absolute",
  top: 0,
  bottom: 0,
  bc: "rgba(0,0,0,.6)",
  pointerEvents: "none",
})

const Playhead = styled("div", {
  position: "absolute",
  top: -2,
  bottom: -2,
  width: 3,
  ml: -1.5,
  br: "$pill",
  bc: "white",
  bs: "0 0 4px rgba(0,0,0,.6)",
  pointerEvents: "none",
})

const Chip = styled("span", {
  px: "$2",
  py: 2,
  br: "$pill",
  bc: "$bg3",
  fontSize: "$2",
  fontVariantNumeric: "tabular-nums",
  color: "$text-primary",
  variants: {
    accent: { true: { bc: "$blue9", color: "white", fontWeight: 600 } },
    warning: { true: { bc: "$red9", color: "white", fontWeight: 600 } },
  },
})

const IconButton = styled("button", {
  all: "unset",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  size: 36,
  br: "$round",
  bc: "rgba(0,0,0,.55)",
  color: "white",
  cursor: "pointer",
  backdropFilter: "blur(4px)",
  "&:hover": { bc: "rgba(0,0,0,.75)" },
})

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = (seconds % 60).toFixed(1).padStart(4, "0")
  return `${m}:${s}`
}

// Grabs evenly spaced frames with a separate, hidden video element
const useFilmstrip = (file: File, duration: number | undefined) => {
  const [frames, setFrames] = useState<string[]>([])

  useEffect(() => {
    if (!duration) return
    let canceled = false
    const url = URL.createObjectURL(file)
    const video = document.createElement("video")
    video.muted = true
    video.playsInline = true
    video.preload = "auto"
    video.src = url

    const canvas = document.createElement("canvas")
    canvas.width = 160
    canvas.height = 90
    const context = canvas.getContext("2d")

    const seek = (time: number) =>
      new Promise<void>((resolve) => {
        video.addEventListener("seeked", () => resolve(), { once: true })
        video.currentTime = time
      })

    const run = async () => {
      await new Promise((resolve) =>
        video.addEventListener("loadeddata", resolve, { once: true })
      )
      const result: string[] = []
      for (let i = 0; i < FILMSTRIP_FRAMES && !canceled; i++) {
        await seek(((i + 0.5) / FILMSTRIP_FRAMES) * duration)
        context?.drawImage(video, 0, 0, canvas.width, canvas.height)
        result.push(canvas.toDataURL("image/jpeg", 0.6))
        // Show frames progressively
        if (!canceled) setFrames([...result])
      }
    }

    run()

    return () => {
      canceled = true
      video.removeAttribute("src")
      video.load()
      URL.revokeObjectURL(url)
    }
  }, [file, duration])

  return frames
}

interface VideoTrimmerProps {
  file: File
  value: TrimRange | undefined
  duration: number | undefined
  onDurationChange: (duration: number) => void
  onChange: (value: TrimRange) => void
  disabled?: boolean
  maxSize: number
}

export const VideoTrimmer = ({
  file,
  value,
  duration,
  onDurationChange,
  onChange,
  disabled,
  maxSize,
}: VideoTrimmerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const frames = useFilmstrip(file, duration)

  // Created and revoked in the same effect so StrictMode's mount/unmount/mount
  // doesn't leave the video pointing at a revoked URL
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const url = URL.createObjectURL(file)
    video.src = url
    return () => {
      video.removeAttribute("src")
      video.load()
      URL.revokeObjectURL(url)
    }
  }, [file])

  // Smooth playhead + loop inside the selected range while playing
  useEffect(() => {
    if (!playing || !value) return
    let frame: number
    const tick = () => {
      const video = videoRef.current
      if (video) {
        if (video.currentTime >= value.end || video.currentTime < value.start - 0.25) {
          video.currentTime = value.start
        }
        setCurrentTime(video.currentTime)
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playing, value])

  // Assumes a roughly constant bitrate; the real size is checked after the cut
  const estimatedSize =
    duration && value ? (file.size * (value.end - value.start)) / duration : file.size
  const estimatedMB = (estimatedSize / 1048576).toFixed(0)
  const overLimit = estimatedSize > maxSize

  const togglePlay = () => {
    const video = videoRef.current
    if (!video || !value) return
    if (video.paused) {
      if (video.currentTime < value.start || video.currentTime >= value.end) {
        video.currentTime = value.start
      }
      video.play()
    } else {
      video.pause()
    }
  }

  const handleValueChange = ([start, end]: number[]) => {
    const video = videoRef.current
    // Seek to whichever handle moved so the user sees that frame
    const time = value && start !== value.start ? start : end
    if (video) {
      video.pause()
      video.currentTime = time
    }
    setCurrentTime(time)
    onChange({ start, end })
  }

  const percent = (time: number) => (duration ? (time / duration) * 100 : 0)

  return (
    <Box css={{ mt: "$3" }}>
      <Box
        css={{
          position: "relative",
          br: "$3",
          overflow: "hidden",
          bc: "black",
          aspectRatio: "16 / 9",
        }}
      >
        <Box
          as={"video"}
          ref={videoRef}
          muted={muted}
          playsInline
          preload="metadata"
          onClick={togglePlay}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onLoadedMetadata={(e: React.SyntheticEvent<HTMLVideoElement>) =>
            onDurationChange(e.currentTarget.duration)
          }
          css={{ width: "100%", height: "100%", objectFit: "contain", cursor: "pointer" }}
        />
        {!playing && (
          <Flex
            as={"button"}
            type="button"
            onClick={togglePlay}
            align={"center"}
            justify={"center"}
            css={{
              all: "unset",
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            aria-label="Reproduzir"
          >
            <Flex
              align={"center"}
              justify={"center"}
              css={{
                size: 56,
                br: "$round",
                bc: "rgba(0,0,0,.55)",
                color: "white",
                backdropFilter: "blur(4px)",
              }}
            >
              <IoPlay size={26} style={{ marginLeft: 3 }} />
            </Flex>
          </Flex>
        )}
        <Flex gap={"2"} css={{ position: "absolute", left: "$2", bottom: "$2" }}>
          {playing && (
            <IconButton type="button" onClick={togglePlay} aria-label="Pausar">
              <IoPause size={18} />
            </IconButton>
          )}
          <IconButton
            type="button"
            onClick={() => setMuted((muted) => !muted)}
            aria-label={muted ? "Ativar som" : "Silenciar"}
          >
            {muted ? <IoVolumeMute size={18} /> : <IoVolumeHigh size={18} />}
          </IconButton>
        </Flex>
      </Box>

      {duration && value ? (
        <>
          <SliderRoot
            min={0}
            max={duration}
            step={0.1}
            minStepsBetweenThumbs={5}
            value={[value.start, value.end]}
            onValueChange={handleValueChange}
            disabled={disabled}
            css={{ mt: "$3" }}
          >
            <SliderTrack>
              <Flex css={{ position: "absolute", inset: 0 }}>
                {Array.from({ length: FILMSTRIP_FRAMES }, (_, i) => (
                  <Box
                    key={i}
                    css={{
                      flex: 1,
                      height: "100%",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      transition: "opacity .3s",
                      opacity: frames[i] ? 1 : 0,
                    }}
                    style={{ backgroundImage: frames[i] && `url(${frames[i]})` }}
                  />
                ))}
              </Flex>
              <Dim style={{ left: 0, width: `${percent(value.start)}%` }} />
              <Dim style={{ left: `${percent(value.end)}%`, right: 0 }} />
              <SliderRange />
              <Playhead style={{ left: `${percent(currentTime)}%` }} />
            </SliderTrack>
            <SliderThumb aria-label="Início" />
            <SliderThumb aria-label="Fim" />
          </SliderRoot>

          <Flex justify={"between"} align={"center"} css={{ mt: "$2" }} gap={"2"}>
            <Flex gap={"1"} align={"center"}>
              <Chip>{formatTime(value.start)}</Chip>
              <Text size={"2"} color={"gray"}>
                –
              </Text>
              <Chip>{formatTime(value.end)}</Chip>
            </Flex>
            <Flex gap={"1"}>
              <Chip accent>{formatTime(value.end - value.start)}</Chip>
              <Chip warning={overLimit}>~{estimatedMB} MB</Chip>
            </Flex>
          </Flex>
          {overLimit && (
            <Text as={"p"} size={"2"} color={"gray"} css={{ mt: "$1" }}>
              Acima de {(maxSize / 1048576).toFixed(0)} MB: o trecho será recomprimido
              para caber no limite (pode perder um pouco de qualidade)
            </Text>
          )}
        </>
      ) : (
        <Box
          css={{
            mt: "$3",
            height: TIMELINE_HEIGHT,
            br: "$3",
            bc: "$bg3",
            animation: `${Glow} 1.5s ease-in-out infinite`,
          }}
        />
      )}
    </Box>
  )
}
