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

interface Props {
  userId: string;
}

export const Content = styled(HoverCard.Content, {
  position: 'relative',
  zIndex: '$modal',
  width: '300px',
  height: '130px',
  backgroundColor: 'black',
  color: '$white',
  borderRadius: '8px',
  fontSize: '$3',
  padding: '14px 10px',
  overflow: 'hidden',
  fontWeight: 'bold',
});

export const OsuHoverCard = ({ userId }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { data } = useQuery(
    ['osu-card', userId],
    async () => {
      const { data } = await axios.get<OsuProfile>(`/api/user/byid/${userId}/osu`);
      return data;
    },
    { staleTime: Infinity, refetchOnWindowFocus: false, retry: false, enabled: !!open }
  );

  return (
    <HoverCard.Root open={open ? true : false} onOpenChange={setOpen}>
      <HoverCard.Trigger asChild>
        <Image src={OsuIcon} alt="" height={32} width={32} />
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <Content>
          <HoverCard.Arrow fill="white" color="white" />
          {data && (
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
                <Image style={{ objectFit: 'cover' }} src={data.cover.url} alt="" fill />
              </Box>
              <Box css={{ zIndex: 999, position: 'inherit', height: '100%' }}>
                <Flex justify={'between'} css={{ height: '100%' }}>
                  <Flex gap={'2'}>
                    <Link href={`https://osu.ppy.sh/users/${data.id}`} target="_blank">
                      <ProfileIcon
                        src={data.avatar_url}
                        css={{ size: '64px' }}
                        rounded={'half'}
                        alt=""
                      />
                    </Link>

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
                        <Link
                          href={`https://osu.ppy.sh/users/${data.id}`}
                          target="_blank"
                        >
                          <Text size={'4'} weight={'bold'}>
                            {data.username}
                          </Text>
                        </Link>
                        <Box>
                          <Text size={'2'}>
                            Desde {new Date(data.join_date).getDate()}/
                            {new Date(data.join_date).getMonth()}/
                            {new Date(data.join_date).getFullYear()}
                          </Text>
                        </Box>
                      </Box>
                      {
                        <Text weight={'bold'}>
                          {data.is_online ? 'Online' : 'Offline'}
                        </Text>
                      }
                    </Flex>
                  </Flex>
                  <Box css={{ ta: 'right' }}>
                    {data.statistics.global_rank && (
                      <>
                        <Box>
                          <Text as={'p'} weight={'bold'}>
                            Global
                          </Text>
                          <Text as={'p'}>#{data.statistics.global_rank}</Text>
                        </Box>
                        <Box
                          css={{
                            my: '6px',
                            height: '1px',
                            bc: 'white',
                          }}
                        />
                        <Box>
                          <Text as={'p'} weight={'bold'}>
                            {data.country.name}
                          </Text>
                          <Text as={'p'}>#{data.statistics.country_rank}</Text>
                        </Box>
                      </>
                    )}
                  </Box>
                </Flex>
              </Box>
            </>
          )}
        </Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};
