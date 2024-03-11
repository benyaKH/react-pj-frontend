import '@mantine/core/styles.css';

import { IconSearch } from '@tabler/icons-react';
import {  AppShell,  Group, TextInput, rem, Stack } from '@mantine/core';
import { useState, useEffect } from 'react';
import StoryCard from '../components/StoryCard';

export default function MainPage() {

    const [value, setValue] = useState('');
    const [stories, setStories] = useState([])

    const urlCategory = `https://pj-backend.up.railway.app/stories/random`

    useEffect(() => {
        const fetchData = async () => {

            await fetch(urlCategory, {
                method: "GET"
            })
                .then(response => response.json())
                .then(result => { setStories(result); })
                .catch(e => console.log(e))
        }
        fetchData()
    }, [])

    const Searchicon = <IconSearch style={{ width: rem(16), height: rem(16) }} />;

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            window.location.href = `/Search/${value}`
        }
      }

      const items = stories.map((item) => (
        <StoryCard id={item['_id']} title={item['storyname']}
            category={item['category']} description={item['description']}
            Ep={item['episodesIn']['length']} image={item['image']} isAdmin={false}></StoryCard>))

    return (
        <AppShell.Main>
            <Stack
                h={300}
                bg="var(--mantine-color-body)"
                gap="xl"
                px={rem(100)}
                py={rem(50)}
            >
                <TextInput
                    radius="xl"
                    mt="md"
                    rightSectionPointerEvents="none"
                    rightSection={Searchicon}
                    placeholder="Search..."
                    onKeyDown={handleKeyDown}
                    onChange={(event) => setValue(event.currentTarget.value)}
                    
                />
                <Group justify="space-between" grow>
                    {items}
                </Group>

            </Stack>
        </AppShell.Main>
    );

}