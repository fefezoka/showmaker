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
            width: 295,
            height: 130,
            bc: '#000',
            br: '$2',
            fontSize: '$3',
            p: '10px',
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
                <Box css={{ position: 'inherit', height: '100%' }}>
                  <Flex justify={'between'} css={{ height: '100%' }}>
                    <Flex gap={'2'}>
                      <Flex direction={'column'} justify={'between'}>
                        <ProfileIcon
                          src={data.avatar_url}
                          css={{ size: '64px', br: '$2' }}
                          alt=""
                        />

                        <Flex justify={'center'} align={'center'}>
                          <Box
                            css={{
                              size: '$6',
                              br: '$round',
                              border: `4px solid ${
                                data.is_online ? '#b3d944' : '$gray3'
                              }`,
                              mb: '$1',
                            }}
                          />
                        </Flex>
                      </Flex>

                      <Flex direction={'column'} justify={'between'}>
                        <Box>
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
                          <Box>
                            <Text color={'white'} size={'1'}>
                              Desde{' '}
                              {Intl.DateTimeFormat('pt-BR').format(
                                data.join_date.getTime()
                              )}
                            </Text>
                          </Box>
                        </Box>
                        <Box>
                          {!data.is_online && data.last_visit && (
                            <Text color={'white'} size={'1'} as={'p'}>
                              Visto por último {diffBetweenDates(data.last_visit)}
                            </Text>
                          )}
                          {
                            <Text color={'white'} size={'1'}>
                              {data.is_online ? 'Online' : 'Offline'}
                            </Text>
                          }
                        </Box>
                      </Flex>
                    </Flex>
                    <>
                      {data.statistics.global_rank && (
                        <Box css={{ ta: 'right' }}>
                          <Flex direction={'column'}>
                            <Text color={'white'} weight={600} size={'1'}>
                              Global
                            </Text>
                            <Text size={'2'}>#{data.statistics.global_rank}</Text>
                          </Flex>
                          <Box
                            css={{
                              my: '6px',
                              height: '1px',
                              bc: 'white',
                            }}
                          />
                          <Flex direction={'column'}>
                            <Text color={'white'} weight={600} size={'1'}>
                              {data.country.name}
                            </Text>
                            <Text size={'2'}>#{data.statistics.country_rank}</Text>
                          </Flex>
                        </Box>
                      )}
                    </>
                  </Flex>
                </Box>
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
