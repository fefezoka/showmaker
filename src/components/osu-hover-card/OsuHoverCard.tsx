import React, { useState } from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';
import { useQuery } from 'react-query';
import { OsuProfile } from 'next-auth/providers/osu';
import axios from 'axios';
import OsuIcon from '../../assets/osu-icon.png';
import Image from 'next/image';
import { Content } from './style';
import { ProfileIcon } from '../profileIcon/ProfileIcon';

interface Props {
  userId: string;
}

export default function OsuHoverCard({ userId }: Props) {
  const [open, setOpen] = useState<boolean>();
  const { data } = useQuery(
    ['osu-card', userId],
    async () => {
      const { data } = await axios.get<OsuProfile>(`/api/user/byid/${userId}/osu`);
      return data;
    },
    { staleTime: Infinity, refetchOnWindowFocus: false, retry: false, enabled: !!open }
  );

  console.log(data);

  return (
    <HoverCard.Root open={open ? true : false} onOpenChange={setOpen}>
      <HoverCard.Trigger asChild>
        <Image src={OsuIcon} alt="" height={32} width={32} />
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <Content>
          {data && (
            <>
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: '60%',
                }}
              >
                <Image style={{ objectFit: 'cover' }} src={data.cover.url} alt="" fill />
              </div>
              <div style={{ zIndex: 999, position: 'inherit', height: '100%' }}>
                <div
                  style={{
                    display: 'flex',
                    height: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <ProfileIcon
                      src={data.avatar_url}
                      size={64}
                      rounded={'half'}
                      alt=""
                    />
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ marginBottom: '2px' }}>
                          <Image
                            src={`https://flagicons.lipis.dev/flags/4x3/${data.country_code.toLowerCase()}.svg`}
                            alt=""
                            width={48}
                            height={27}
                          />
                        </div>
                        <p style={{ fontSize: '16px' }}>{data.username}</p>
                      </div>
                      {<span>{data.is_online ? 'Online' : 'Offline'}</span>}
                    </div>
                  </div>
                  <div>
                    {data.statistics.global_rank && <p>data.statistics.global_rank</p>}
                    {/* {data.rank_highest && <p>#{data.rank_highest.rank}</p>} */}
                  </div>
                </div>
              </div>
            </>
          )}
        </Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
