import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { trpc } from '@/utils/trpc';
import { Box } from '@/styles/box';
import { Flex } from '@/styles/flex';
import { ProfileIcon } from '@/styles/profile-icon';
import { ProviderIcon } from '@/styles/provider-icon';
import { diffBetweenDates } from '@/utils/diff-between-dates';
import {
  HoverCard,
  HoverCardArrow,
  HoverCardContent,
  HoverCardTrigger,
} from '@/styles/hover-card';
import { Text } from '@/styles/text';

interface IOsuHoverCard {
  username: string;
  osuAccountId: string;
}

export const OsuHoverCard = ({ username, osuAccountId }: IOsuHoverCard) => {
  const [open, setOpen] = useState<boolean>(false);
  const { data, isLoading } = trpc.user.osu.useQuery({ username }, { enabled: open });

  return (
    <HoverCard open={open} onOpenChange={setOpen}>
      <HoverCardTrigger asChild>
        <Link href={`https://osu.ppy.sh/users/${osuAccountId}`} target={'_blank'}>
          <ProviderIcon provider="osu" />
        </Link>
      </HoverCardTrigger>
      <Link href={`https://osu.ppy.sh/users/${osuAccountId}`} target={'_blank'}>
        <HoverCardContent
          css={{
            border: 0,
            position: 'relative',
            width: 290,
            height: 120,
            bc: '#000',
            br: '$2',
            fontSize: '$3',
            overflow: 'hidden',
            fontWeight: 600,
          }}
        >
          <HoverCardArrow fill="white" color="white" />
          {!isLoading ? (
            data && (
              <>
                <Box
                  css={{
                    position: 'absolute',
                    size: '100%',
                    inset: 0,
                    opacity: '45%',
                  }}
                >
                  <Image
                    style={{ objectFit: 'cover' }}
                    src={data.cover.url}
                    alt=""
                    fill
                  />
                </Box>
                <Flex direction={'column'} css={{ position: 'inherit', height: '100%' }}>
                  <Flex css={{ p: 10 }}>
                    <ProfileIcon
                      src={data.avatar_url}
                      css={{ size: 60, br: '$2' }}
                      alt=""
                    />
                    <Box css={{ ml: 10 }}>
                      <Box>
                        <Box
                          as={Image}
                          css={{ mb: '2px', br: '$1', overflow: 'hidden' }}
                          src={`https://flagicons.lipis.dev/flags/4x3/${data.country_code.toLowerCase()}.svg`}
                          alt=""
                          width={36}
                          height={27}
                        />
                      </Box>
                      <Text color={'white'} size={'4'} weight={600}>
                        {data.username}
                      </Text>
                    </Box>
                  </Flex>

                  <Flex align={'center'} css={{ p: 10, pt: 0 }}>
                    <Flex css={{ width: 60 }} justify={'center'} align={'center'}>
                      <Box
                        css={{
                          size: '$6',
                          br: '$round',
                          border: `4px solid ${data.is_online ? '#b3d944' : '$gray3'}`,
                        }}
                      />
                    </Flex>
                    <Box css={{ ml: 10 }}>
                      {!data.is_online && data.last_visit && (
                        <Text weight={'500'} color={'white'} size={'1'} as={'p'}>
                          Visto por último {diffBetweenDates(data.last_visit)}
                        </Text>
                      )}
                      {
                        <Text weight={'500'} color={'white'} size={'2'}>
                          {data.is_online ? 'Online' : 'Offline'}
                        </Text>
                      }
                    </Box>
                  </Flex>
                </Flex>
              </>
            )
          ) : (
            <Flex justify={'center'} css={{ mt: '$1' }}>
              <Text color={'white'} weight={600}>
                Carregando...
              </Text>
            </Flex>
          )}
        </HoverCardContent>
      </Link>
    </HoverCard>
  );
};
