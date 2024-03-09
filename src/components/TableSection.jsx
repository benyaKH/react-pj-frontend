
import '@mantine/core/styles.css';
import { IconNewSection } from '@tabler/icons-react';
import { ActionIcon, Anchor, Button, Group, Modal, Stack, TagsInput, Text, TextInput, rem, Loader, Center } from '@mantine/core';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import * as XLSX from "xlsx";


import EpisodeTable from './EpisodeTable';

export default function TableSection(props) {


    const [opened, handlers] = useDisclosure(false);
    const [popupstate, setPopupState] = useState('New Episode')
    const [loading, setLoading] = useState(false)

    const [data, setData] = useState([])

    const [number, setNumber] = useState('')
    const [episodetitle, setTitle] = useState('')
    const [description, setDes] = useState('')
    const [tags, setTags] = useState([]);
    const [characters, setChars] = useState([]);
    const [Links, setLink] = useState('')
    const [StoryId] = useState(props.stid)
    const [newChoices, setNewChoices] = useState(true)



    const urlNewEpisodes = `https://pj-backend.up.railway.app/episodes`

    const onSubmitNew = () => {
        setLoading(true)
        const payload = {
            number,
            episodetitle,
            description,
            tags,
            characters,
            Links,
            StoryId,

        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        };
        fetch(urlNewEpisodes, requestOptions)
            .then(response => response.json())
            .then(data => { console.log(data); setLoading(false) });
    }

    const handleFileUpload = (e) => {
        console.log(e)
        const reader = new FileReader();
        reader.readAsBinaryString(e.target.files[0]);
        reader.onload = (e) => {
            if (e.target != null) {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const parsedData = XLSX.utils.sheet_to_json(sheet);
                setData(parsedData);
            }
        };
    }

    const onSubmitNews = () => {
        setLoading(true)
        data.forEach((element) => {
            if (element['Tags'] != undefined) {
                element['Tags'] = element.Tags.split(',')
            }
            if (element['Characters/Guest'] != undefined) {
                element['Characters/Guest'] = element['Characters/Guest'].split(',')
            }

            const payload = {
                number: element['Episode number'],
                episodetitle: element['Episode title'],
                description: element['Description'],
                tags: element['Tags'],
                characters: element['Characters/Guest'],
                Links: element['Links'],
                StoryId
            }
            console.log(element)
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            };
            fetch(urlNewEpisodes, requestOptions)
                .then(response => response.json())
                .then(data => { console.log(data); setLoading(false); location.reload(); });
        })

    }

    function convertToBase64(e) {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            if (typeof (reader.result) == 'string') {
                setImage(reader.result)
            }
        };
        reader.onerror = error => {
            console.log("Error:", error)
        }
    }

    // const Rqtags =  [...new Set(array.map((item) => item.age))];

    const downloadfile = () => {
        var link = document.createElement('a');
        const data = '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'
        link.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + encodeURIComponent(data);
        link.setAttribute('download', 'template.xlsx');

        link.style.display = 'none';
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    }




    return (
        <div>
            {loading ? <Center py="60"><Loader color="blue" size="xl" /> </Center> :
                <div>
                    <Group py="xl" justify='space-between'>
                        <Text size={rem(25)} fw={500}>
                            Episodes
                        </Text>
                        {/* add new episode */}
                        {props.isAdmin &&
                            <Button rightSection={<IconNewSection style={{ width: '130%', height: '130%' }} stroke={1.5} />}
                                variant="light" color='black' aria-label="EditDes" onClick={() => { handlers.open(); setPopupState('New Episode'); }}>
                                Create Episode
                            </Button>
                        }
                    </Group>

                    <Modal opened={opened} onClose={() => handlers.close()} title={popupstate} centered>

                        <div>
                            <Group>
                                <Anchor onClick={() => setNewChoices(true)} underline="hover" color='black'>
                                    one-by-one
                                </Anchor>
                                <Anchor onClick={() => setNewChoices(false)} underline="hover" color='black'>
                                    files
                                </Anchor>
                            </Group>
                            {newChoices ?
                                <form onSubmit={onSubmitNew}>
                                    <TextInput
                                        withAsterisk
                                        label="No."
                                        placeholder="your episode no."
                                        onChange={e => setNumber(e.target.value)}
                                    />
                                    <TextInput
                                        withAsterisk
                                        label="Title"
                                        placeholder="your episode title"
                                        onChange={e => setTitle(e.target.value)}
                                    />
                                    <TextInput
                                        label="Description"
                                        placeholder="your episode description"
                                        onChange={e => setDes(e.target.value)}
                                    />

                                    <TagsInput
                                        label="Tag"
                                        placeholder="Enter tag"
                                        clearable
                                        onChange={setTags}
                                    />
                                    <TagsInput
                                        label="Characters"
                                        placeholder="Enter characters name"
                                        clearable

                                        onChange={setChars}
                                    />
                                    <TextInput
                                        withAsterisk
                                        label="Link"
                                        placeholder="your episode link"
                                        onChange={e => setLink(e.target.value)}
                                    />

                                    <Group justify="flex-end" mt="md">
                                        <Button type="submit" onClick={() => handlers.close()} color="#2CB5B5">Submit</Button>
                                        <Button type="reset" variant="outline" color="#FF6666">Cancle</Button>
                                    </Group>
                                </form> :
                                <div>
                                    <Stack py="lg">
                                        <Button onClick={downloadfile}>Download Template</Button>
                                        <input
                                            type="file"
                                            accept=".xlsx, .xls"
                                            onChange={handleFileUpload}
                                        />
                                        <Group justify="flex-end" mt="md">
                                            <Button type="submit" onClick={onSubmitNews} color="#2CB5B5">Submit</Button>
                                        </Group>
                                    </Stack>

                                </div>
                            }
                        </div>
                    </Modal>
                    {/* Table */}
                    <EpisodeTable stid={props.stid} isAdmin={props.isAdmin} />
                </div>}

        </div>


    );

}