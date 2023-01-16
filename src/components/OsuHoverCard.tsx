import React, { useState } from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';
import { useQuery } from 'react-query';
import { OsuProfile } from 'next-auth/providers/osu';
import axios from 'axios';
import OsuIcon from '../assets/osu-icon.png';
import Image from 'next/image';
import { ProfileIcon } from './ProfileIcon';
import { Box, Flex, Text } from '../styles';
import { styled } from '../../stitches.config';
import Link from 'next/link';
import { diffBetweenDates } from '../utils/diffBetweenDates';

interface Props {
  userId: string;
  osuAccountId: number;
}

export const Content = styled(HoverCard.Content, {
  position: 'relative',
  width: 290,
  height: 130,
  backgroundColor: '#000',
  color: '$white',
  borderRadius: '$2',
  fontSize: '$3',
  padding: '10px',
  overflow: 'hidden',
  fontWeight: 'bold',
});

export const OsuHoverCard = ({ userId, osuAccountId }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { data, isLoading } = useQuery(
    ['osu-card', userId],
    async () => {
      const { data } = await axios.get<OsuProfile>(`/api/user/byid/${userId}/osu`);
      return data;
    },
    { enabled: !!open }
  );

  return (
    <HoverCard.Root open={open ? true : false} onOpenChange={setOpen}>
      <HoverCard.Trigger asChild>
        <Link href={`https://osu.ppy.sh/users/${osuAccountId}`} target={'_blank'}>
          <Image src={OsuIcon} alt="" height={32} width={32} />
        </Link>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <Link href={`https://osu.ppy.sh/users/${osuAccountId}`} target="_blank">
          <Content>
            <HoverCard.Arrow fill="white" color="white" />
            {!isLoading ? (
              data && (
                <>
                  <Box
                    css={{
                      position: 'absolute',
                      size: '100%',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
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
                                  data.is_online ? '#b3d944' : '$black'
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

                            <Text size={'4'} weight={'bold'}>
                              {data.username}
                            </Text>
                            <Box>
                              <Text size={'2'}>
                                Desde {new Date(data.join_date).getDate()}/
                                {new Date(data.join_date).getMonth()}/
                                {new Date(data.join_date).getFullYear()}
                              </Text>
                            </Box>
                          </Box>
                          <Box>
                            {!data.is_online && data.last_visit && (
                              <Text size={'2'} as={'p'}>
                                Visto por último{' '}
                                {diffBetweenDates(new Date(), new Date(data.last_visit))}
                              </Text>
                            )}
                            {
                              <Text size={'3'}>
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
                              <Text weight={'bold'} size={'3'}>
                                Global
                              </Text>
                              <Text size={'3'}>#{data.statistics.global_rank}</Text>
                            </Flex>
                            <Box
                              css={{
                                my: '6px',
                                height: '1px',
                                bc: 'white',
                              }}
                            />
                            <Flex direction={'column'}>
                              <Text weight={'bold'} size={'3'}>
                                {data.country.name}
                              </Text>
                              <Text size={'3'}>#{data.statistics.country_rank}</Text>
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
                <Text weight={'bold'}>Carregando...</Text>
              </Flex>
            )}
          </Content>
        </Link>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};
