import Image from "next/image"
import React, { forwardRef, useState } from "react"
import { CSS } from "stitches.config"
import { Box } from "@/styles/box"
import { trpc } from "@/utils/trpc"

interface ProfileIconProps extends React.ComponentProps<typeof Image> {
  src: string
  css?: CSS
  userId?: string
}

export const ProfileIcon = forwardRef<HTMLImageElement, ProfileIconProps>(
  ({ src, css, userId, ...props }: ProfileIconProps, forwardedRef) => {
    const [error, setError] = useState(false)
    const [refreshedSrc, setRefreshedSrc] = useState<string | null>(null)
    const utils = trpc.useUtils()
    const refreshImage = trpc.user.refreshImage.useMutation({
      onSuccess: (image) => {
        if (image) {
          setRefreshedSrc(image)
          setError(false)
          utils.invalidate()
        }
      },
    })

    const handleError = () => {
      setError(true)
      if (userId && !refreshedSrc && !refreshImage.isPending) {
        refreshImage.mutate({ userId })
      }
    }

    return (
      <Box
        css={{
          size: "$7",
          br: "$round",
          fs: 0,
          position: "relative",
          overflow: "hidden",
          ...css,
        }}
      >
        <Image
          ref={forwardedRef}
          src={!error ? refreshedSrc ?? src : "https://cdn.discordapp.com/embed/avatars/0.png"}
          {...props}
          fill
          alt=""
          onError={handleError}
        />
      </Box>
    )
  }
)

ProfileIcon.displayName = "ProfileIcon"
