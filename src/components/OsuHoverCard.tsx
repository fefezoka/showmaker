import React, { useState } from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';
import Image from 'next/image';
import Link from 'next/link';
import { trpc, diffBetweenDates } from '@utils';
import { styled } from 'stitches.config';
import { Box, Flex, Text, ProfileIcon, ProviderIcon } from '@styles';

interface IOsuHoverCard {
  username: string;
  osuAccountId: string;
}

export const Content = styled(HoverCard.Content, {
  position: 'relative',
  width: 295,
  height: 130,
  bc: '#000',
  br: '$2',
  fontSize: '$3',
  p: '10px',
  overflow: 'hidden',
  fontWeight: 'bold',
});

export const OsuHoverCard = ({ username, osuAccountId }: IOsuHoverCard) => {
  const [open, setOpen] = useState<boolean>(false);
  const { data, isLoading } = trpc.user.osu.useQuery({ username }, { enabled: open });

  return (
    <HoverCard.Root open={open} onOpenChange={setOpen}>
      <HoverCard.Trigger asChild>
        <Link href={`https://osu.ppy.sh/users/${osuAccountId}`} target={'_blank'}>
          <ProviderIcon provider="osu" />
        </Link>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <Link href={`https://osu.ppy.sh/users/${osuAccountId}`} target={'_blank'}>
          <Content>
            <HoverCard.Arrow fill="white" color="white" />
            {!isLoading ? (
              data && (
                <>
                  <Box
                    css={{
                      position: 'absolute',
                      size: '100%',
                      inset: 0,
                      opacity: '60%',
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
                            <Box css={{ mb: '2px' }}>
                              <Image
                                src={`https://flagicons.lipis.dev/flags/4x3/${data.country_code.toLowerCase()}.svg`}
                                alt=""
                                width={36}
                                height={27}
                              />
                            </Box>

                            <Text size={'4'} weight={600}>
                              {data.username}
                            </Text>
                            <Box>
                              <Text size={'1'}>
                                Desde{' '}
                                {Intl.DateTimeFormat('pt-BR').format(
                                  data.join_date.getTime()
                                )}
                              </Text>
                            </Box>
                          </Box>
                          <Box>
                            {!data.is_online && data.last_visit && (
                              <Text size={'1'} as={'p'}>
                                Visto por último {diffBetweenDates(data.last_visit)}
                              </Text>
                            )}
                            {
                              <Text size={'1'}>
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
                              <Text weight={600} size={'1'}>
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
                              <Text weight={600} size={'1'}>
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
                <Text weight={600}>Carregando...</Text>
              </Flex>
            )}
          </Content>
        </Link>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};
