
import '@mantine/core/styles.css';
import { IconNewSection} from '@tabler/icons-react';
import { ActionIcon, Anchor, Button, Group, Modal, Stack, TagsInput, Text, TextInput, rem, Loader } from '@mantine/core';
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

    // const Rqtags =  [...new Set(array.map((item) => item.age))];

    const downloadfile = () =>{
        fetch("template.xlsx").then((response) => {
            response.blob().then((blob) => {
             
                // Creating new object of PDF file
                const fileURL =
                    window.URL.createObjectURL(blob);
                     
                // Setting various property values
                let alink = document.createElement("a");
                alink.href = fileURL;
                alink.download = "template.xlsx";
                alink.click();
            });
        });
    }




    return (
        <div>
            {loading ? <Center py="60"><Loader color="blue" size="xl" /> </Center> :
                <div>
                    <Group>
                        <Text size={rem(25)} fw={500}>
                            Episode
                        </Text>

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
                        {/* add new episode */}
                        {props.isAdmin ?
                            <ActionIcon variant="subtle" color='black' aria-label="EditDes" onClick={() => { handlers.open(); setPopupState('New Episode'); }}>
                                <IconNewSection style={{ width: '130%', height: '130%' }} stroke={1.5} />
                            </ActionIcon> : <div></div>}
                    </Group>
                    {/* Table */}
                    <EpisodeTable stid={props.stid} isAdmin={props.isAdmin} />
                </div>}

        </div>


    );

}