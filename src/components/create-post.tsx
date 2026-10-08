import React, { useState } from "react"
import Dropzone from "react-dropzone"
import { z } from "zod"
import { signIn, useSession } from "next-auth/react"
import { Controller, useForm, Control, FieldValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreatePost } from "@/hooks/post"
import { Box } from "@/styles/box"
import { Button } from "@/styles/button"
import { Flex } from "@/styles/flex"
import { Heading } from "@/styles/heading"
import { Input } from "@/styles/input"
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalTitle,
  ModalDescription,
  ModalClose,
} from "@/styles/modal"
import { Select } from "@/styles/select"
import { Text } from "@/styles/text"
import { trimVideo } from "@/utils/trim-video"
import { TrimRange, VideoTrimmer } from "@/components/video-trimmer"

// Cloudinary's per-file limit; applies to the trimmed clip, not the original
const MAX_UPLOAD_SIZE = 100 * 1024 * 1024
// The original is only read locally, so it can be much bigger
const MAX_SOURCE_SIZE = 4 * 1024 * 1024 * 1024

export const gameOptions = [
  { label: "Valorant", value: "valorant" },
  { label: "FIFA", value: "fifa" },
  { label: "CS:GO", value: "csgo" },
  { label: "LOL", value: "lol" },
  { label: "Euro truck", value: "euro-truck" },
  { label: "Outros", value: "other" },
] as const

const createPostSchema = z.object({
  file: z.object(
    {
      video: typeof window === "undefined" ? z.any() : z.instanceof(File),
    },
    { required_error: "Selecione um vídeo" }
  ),
  trim: z.object({ start: z.number(), end: z.number() }).optional(),
  title: z.string(),
  game: z.object(
    { value: z.string(), label: z.string() },
    { required_error: "O jogo é obrigatório" }
  ),
})

type CreatePostData = z.infer<typeof createPostSchema>

export const CreatePost = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [duration, setDuration] = useState<number>()
  const [isTrimming, setIsTrimming] = useState(false)
  const [trimProgress, setTrimProgress] = useState(0)
  const [uploadSize, setUploadSize] = useState(0)
  const { data: session } = useSession()
  const createPost = useCreatePost()

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CreatePostData>({
    resolver: zodResolver(createPostSchema),
  })

  const handleCreatePost = async ({ file, trim, ...data }: CreatePostData) => {
    let video: File = file.video
    const isTrimmed =
      trim && duration && (trim.start > 0.05 || trim.end < duration - 0.05)

    if (isTrimmed || video.size > MAX_UPLOAD_SIZE) {
      setIsTrimming(true)
      setTrimProgress(0)
      try {
        video = await trimVideo(video, trim ?? { start: 0 }, {
          maxSize: MAX_UPLOAD_SIZE,
          onProgress: setTrimProgress,
        })
      } catch (error) {
        console.error(error)
        return setError("file", {
          type: "trim",
          message:
            error instanceof Error ? error.message : "Não foi possível cortar esse vídeo",
        })
      } finally {
        setIsTrimming(false)
      }
    }

    if (video.size > MAX_UPLOAD_SIZE) {
      return setError("file", {
        type: "trim",
        message: `O trecho tem ${(video.size / 1048576).toFixed(0)} MB, corte para menos de 100 MB`,
      })
    }

    setUploadSize(video.size)
    await createPost.mutateAsync({
      ...data,
      file: { ...file, video },
      game: data.game.value,
    })
    setOpen(false)
    createPost.reset()
  }

  const isBusy = isTrimming || createPost.isLoading

  return (
    <Modal
      open={open}
      onOpenChange={(open) => {
        if (open && !session) {
          return signIn("discord")
        }

        setOpen(open)
        reset()
        setDuration(undefined)
      }}
    >
      <ModalTrigger asChild>
        <Button
          css={{
            width: "100%",
            br: "$pill",
            height: 48,
            fontSize: "$4",
            fontWeight: 600,
          }}
        >
          Postar vídeo
        </Button>
      </ModalTrigger>
      <ModalContent
        onInteractOutside={(e) => (isBusy ? e.preventDefault() : setOpen(false))}
      >
        <Box as={"form"} onSubmit={handleSubmit(handleCreatePost)}>
          <ModalTitle asChild>
            <Heading size="3" css={{ lh: "unset" }}>
              Postar vídeo
            </Heading>
          </ModalTitle>
          <ModalDescription asChild>
            <Text color={"gray"} size={"4"}>
              Posta alguma play ai mano
            </Text>
          </ModalDescription>
          <Box css={{ mt: "$5" }}>
            <Flex>
              <Text as={"label"}>Título</Text>
            </Flex>
            <Input
              {...register("title")}
              placeholder="Escreva um título - Opcional"
              css={{ px: "$3", my: "$1" }}
            />

            <Box css={{ mt: "$1" }}>
              <Flex justify={"between"}>
                <Text as={"label"}>Jogo</Text>
                {errors.game && (
                  <Text color={"red"} weight={600}>
                    {errors.game.message}
                  </Text>
                )}
              </Flex>

              <Box css={{ my: "$1" }}>
                <Select
                  control={control as unknown as Control<FieldValues>}
                  name="game"
                  placeholder={"Selecione um jogo"}
                  options={gameOptions}
                />
              </Box>
            </Box>
          </Box>
          <Controller
            name="file"
            control={control}
            render={({ field: fileField }) =>
              fileField.value?.video ? (
                <Box>
                  <Controller
                    name="trim"
                    control={control}
                    render={({ field }) => (
                      <VideoTrimmer
                        file={fileField.value.video}
                        value={field.value}
                        duration={duration}
                        disabled={isBusy}
                        maxSize={MAX_UPLOAD_SIZE}
                        onDurationChange={(duration) => {
                          setDuration(duration)
                          field.onChange({ start: 0, end: duration } as TrimRange)
                        }}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <Flex justify={"between"} align={"center"} gap={"2"} css={{ mt: "$2" }}>
                    <Text
                      size={"2"}
                      color={"gray"}
                      css={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fileField.value.video.name}
                    </Text>
                    {!isBusy && (
                      <Text
                        as={"button"}
                        type="button"
                        size={"2"}
                        weight={600}
                        css={{ all: "unset", cursor: "pointer", color: "$blue11", fs: 0 }}
                        onClick={() => {
                          fileField.onChange(undefined)
                          setValue("trim", undefined)
                          setDuration(undefined)
                        }}
                      >
                        Trocar vídeo
                      </Text>
                    )}
                  </Flex>
                </Box>
              ) : (
                <Dropzone
                  accept={{ "video/*": [] }}
                  onDropAccepted={(files) => {
                    setDuration(undefined)
                    setValue("trim", undefined)
                    fileField.onChange({ video: files[0] })
                  }}
                  maxSize={MAX_SOURCE_SIZE}
                >
                  {({ getRootProps, getInputProps, fileRejections, isDragActive }) => (
                    <Flex
                      justify={"center"}
                      direction={"column"}
                      align={"center"}
                      gap={"1"}
                      css={{
                        width: "100%",
                        height: "120px",
                        border: "2px dashed $bg4",
                        bc: "$bg2",
                        mt: "$4",
                        br: "$2",
                        p: "$3",
                        cursor: "pointer",
                        ...(isDragActive && { borderColor: "$blue9" }),
                      }}
                      {...getRootProps()}
                    >
                      <Box as={"input"} {...getInputProps()} />
                      {fileRejections.length !== 0 && (
                        <Text weight={600}>Arquivo inválido ou muito grande</Text>
                      )}
                      {errors.file && (
                        <Text weight={600} color={"red"}>
                          {errors.file.message}
                        </Text>
                      )}
                      <Text color={"gray"}>Arraste um vídeo ou clique para procurar</Text>
                      <Text color={"gray"}>Limite de 100 MB depois do corte</Text>
                    </Flex>
                  )}
                </Dropzone>
              )
            }
          />
          {errors.file?.type === "trim" && (
            <Text as={"p"} color={"red"} weight={600} css={{ mt: "$2" }}>
              {errors.file.message}
            </Text>
          )}
          {isBusy && (
            <Box css={{ mt: "$3" }}>
              <Flex justify={"between"}>
                <Text size={"2"} weight={600}>
                  {isTrimming ? "Cortando vídeo..." : "Enviando..."}
                </Text>
                <Text
                  size={"2"}
                  color={"gray"}
                  css={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {isTrimming
                    ? `${(trimProgress * 100).toFixed(0)}%`
                    : `${((uploadSize / 1048576) * createPost.progress).toFixed(0)} / ${(
                        uploadSize / 1048576
                      ).toFixed(0)} MB · ${(createPost.progress * 100).toFixed(0)}%`}
                </Text>
              </Flex>
              <Box
                css={{ mt: "$1", height: 6, br: "$pill", bc: "$bg4", overflow: "hidden" }}
              >
                <Box
                  css={{
                    height: "100%",
                    bc: "$blue9",
                    br: "$pill",
                    transition: "width .2s",
                  }}
                  style={{
                    width: `${((isTrimming ? trimProgress : createPost.progress) * 100).toFixed(1)}%`,
                  }}
                />
              </Box>
            </Box>
          )}
          <Flex justify={"between"} align={"center"} css={{ mt: "$4" }}>
            <ModalClose asChild>
              <Button disabled={isBusy} variant={"red"}>
                Sair
              </Button>
            </ModalClose>
            <Button type="submit" loading={isBusy}>
              Enviar
            </Button>
          </Flex>
        </Box>
      </ModalContent>
    </Modal>
  )
}
