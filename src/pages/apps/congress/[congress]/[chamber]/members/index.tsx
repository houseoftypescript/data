import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { CongressMember, Member, Party, State } from '@prisma/client';
import axios from 'axios';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
} from 'next';
import Image from 'next/image';
import React, { useState } from 'react';
import Breadcrumbs from '../../../../../../components/organisms/Breadcrumbs';
import AppsTemplate from '../../../../../../components/templates/Apps';

export type ExtendedCongressMember = CongressMember & {
  member: Member;
  state: State;
};

export type MembersPageProps = {
  members: ExtendedCongressMember[];
};

const partyColor: Record<Party, string> = {
  DEMOCRATIC: 'bg-blue-500',
  REPUBLICAN: 'bg-red-500',
  INDEPENDENT: 'bg-gray-500',
};

const sortByMap: Record<string, string> = {
  seniority: 'group',
};

const Members: React.FC<{
  membersByGroups: { group: string; members: CongressMember[] }[];
  openModal: (id: string) => void;
}> = ({ membersByGroups = [], openModal = (_id: string) => {} }) => {
  return (
    <div className="grid grid-cols-2">
      {membersByGroups.map((membersByGroup) => {
        const { group } = membersByGroup;
        return (
          <div key={group} className="col-span-1">
            <h1 className="text-center text-xl p-8">
              {group} ({membersByGroup.members.length})
            </h1>
            <div className={`grid grid-cols-12`}>
              {membersByGroup.members.map((member) => {
                const party = member.party;
                const bgColor = partyColor[party];
                return (
                  <div
                    key={member.memberId}
                    className="flex justify-center items-center py-2"
                  >
                    <div
                      onClick={() => openModal(member.memberId)}
                      className={`cursor-pointer w-8 h-8 rounded-full text-white text-center leading-8 text-xs ${bgColor}`}
                    >
                      {member.stateId}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const HousePage: NextPage<MembersPageProps> = ({ members }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [member, setMember] = useState<ExtendedCongressMember>();
  const [groupKey, setGroup] = useState<string>('party');

  const groups = [
    ...new Set(members.map((congressMember: any) => congressMember[groupKey])),
  ].sort();
  const membersByGroups = groups.map((group) => {
    const membersByGroup = members
      .filter((member: any) => member[groupKey] === group)
      .sort((a, b) => {
        if (a.party === b.party) {
          return a.stateId > b.stateId ? 1 : -1;
        }
        return a.party > b.party ? 1 : -1;
      });
    return { group, members: membersByGroup };
  });
  const sortByKey = sortByMap[groupKey] || '';
  membersByGroups.sort((a: any, b: any) => {
    if (sortByKey === '') {
      return a.members.length < b.members.length ? 1 : -1;
    }
    return a[sortByKey] < b[sortByKey] ? 1 : -1;
  });

  return (
    <AppsTemplate>
      <main className="container mx-auto p-8">
        <Breadcrumbs />
        <FormControl fullWidth>
          <InputLabel id="group-label">Group</InputLabel>
          <Select
            labelId="group-label"
            id="group-select"
            value={groupKey}
            label="Group"
            onChange={(event) => setGroup(event.target.value)}
          >
            <MenuItem value="party">Party</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="seniority">Seniorty</MenuItem>
            <MenuItem value="stateId">State</MenuItem>
          </Select>
        </FormControl>
        <Members
          membersByGroups={membersByGroups}
          openModal={(id: string) => {
            setOpen(true);
            const member = members.find((member) => member.memberId === id);
            setMember(member);
          }}
        />
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          className="flex items-center justify-center"
        >
          <Box className="bg-white p-8 rounded max-w-lg w-full">
            <Typography
              id="title"
              variant="h6"
              component="h2"
              className="text-center"
            >
              {member?.member.firstName} {member?.member.middleName}{' '}
              {member?.member.lastName} ({member?.party})
            </Typography>
            <Typography component="h3" className="text-center">
              {member?.state.name}
            </Typography>
            <Image
              src={`https://theunitedstates.io/images/congress/original/${member?.memberId}.jpg`}
              alt={member?.memberId || 'Alt'}
              width={450}
              height={550}
              className="rounded mt-4 w-1/2 mx-auto"
            />
          </Box>
        </Modal>
      </main>
    </AppsTemplate>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<MembersPageProps>> => {
  const congress = context.query.congress as string;
  const chamber = context.query.chamber as string;
  const url: string = `http://localhost:3000/api/congress/${congress}/${chamber}/members`;
  const response = await axios.get<{ members: ExtendedCongressMember[] }>(url);
  const members = response.data.members;
  return { props: { members } };
};

export default HousePage;
