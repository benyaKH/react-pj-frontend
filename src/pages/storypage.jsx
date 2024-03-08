import '@mantine/core/styles.css';
import { useParams } from 'react-router-dom';
import { AppShell, Group, TextInput, rem, Text, Stack, Divider, ActionIcon, Button, Switch, AspectRatio, Container, Grid, BackgroundImage, Center, Modal, Loader } from '@mantine/core';

import { IconEdit } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

import TableSection from '../components/TableSection';
import { useDisclosure } from '@mantine/hooks';

import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';

export default function StoryPage(props) {

    const params = useParams()
    const [loading, setLoading] = useState(false)
    const [IsPublic, setIsPublic] = useState(false)
    const [opened, handlers] = useDisclosure(false);

    const mainurl = 'https://pj-backend.up.railway.app'

    const urlStory = `${mainurl}/stories/${params.id}`
    const urleditStory = `${mainurl}/stories/${params.id}`

    const [storyname, setStoryname] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [IsEditName, setIsEditName] = useState(false)
    const [IsEditDEs, setIsEditDes] = useState(false)

    const [image, setImage] = useState("")

    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {

            await fetch(urlStory, {
                method: "GET"
            })
                .then(response => response.json())
                .then(result => {
                    setStoryname(result.storyname); setDescription(result.description);
                    setCategory(result.category); setIsPublic(result.IsPublic); setImage(result.image);
                    setLoading(false)
                })
                .catch(e => console.log(e))
        }
        fetchData()
    }, [])

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            Highlight,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content:description,
        onUpdate({ editor }) {
            setDescription(editor?.getJSON().content[0].content[0].text);
          }
    });

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
    const onSubmitEdit = () => {
        const payload = {
            storyname,
            description
        }
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        };
        fetch(urleditStory, requestOptions)
            .then(response => response.json())
            .then(data => console.log(data));
        setIsEditName(false)
        setIsEditDes(false)
    }

    const onUploadImage = () => {
        setLoading(true)
        const payload = {
            image
        }
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        };
        fetch(urleditStory, requestOptions)
            .then(response => response.json())
            .then(data => { console.log(data); setLoading(false); location.reload(); });
    }

    const onPublic = () => {

        setIsPublic(!IsPublic)
        const payload = {
            IsPublic: !IsPublic
        }
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        };
        fetch(urleditStory, requestOptions)
            .then(response => response.json())
            .then(data => console.log(data));
    }

    return (
        <AppShell.Main>
            {loading ? <Center py="60"><Loader color="blue" size="xl" /> </Center> :
                <Stack
                    bg="var(--mantine-color-body)"
                >
                    <div>
                        <Container fluid px={0} >
                            <AspectRatio mah={300} ratio={16 / 9}>
                                <BackgroundImage
                                    src={image == "" || image == null ?
                                        "https://images.unsplash.com/photo-1579227114347-15d08fc37cae?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
                                        : image}
                                    radius="xs" h={300}
                                >
                                </BackgroundImage>
                                {props.isAdmin &&
                                    <Center p="md" >
                                        <ActionIcon variant="filled" size="xl" color='black' aria-label="EditName0" onClick={() => handlers.open()}>
                                            <IconEdit style={{ width: '100%', height: '100%' }} stroke={1.5} />
                                        </ActionIcon>
                                    </Center>}
                            </AspectRatio>
                        </Container>
                    </div>


                    <Stack px={rem(100)}>
                        <Stack gap={rem(1)}>
                            <Group justify="space-between">
                                <Group>
                                    {IsEditName ?
                                        <TextInput
                                            variant="unstyled"
                                            onChange={e => setStoryname(e.target.value)}
                                            value={storyname}
                                            size="xl"

                                        /> :
                                        <Text size={rem(40)} fw={700}>
                                            {storyname}
                                        </Text>}
                                    {props.isAdmin ? IsEditName ?
                                        <Button type="submit" onClick={onSubmitEdit} color="#2CB5B5">Submit</Button> :
                                        <ActionIcon variant="subtle" color='black' aria-label="EditName0" onClick={() => setIsEditName(true)}>
                                            <IconEdit style={{ width: '130%', height: '130%' }} stroke={1.5} />
                                        </ActionIcon> : <div></div>}
                                </Group>

                                {props.isAdmin ?
                                    <Switch checked={IsPublic} onChange={onPublic} label={"Public"} mt="md" /> : <div></div>}
                            </Group>

                            <Text td="underline" color='gray'>
                                {category}
                            </Text>
                        </Stack>

                        <Grid columns={9}>
                            <Grid.Col span={8}> {IsEditDEs ?
                                <RichTextEditor editor={editor} onChange={setDescription}>
                                    <RichTextEditor.Toolbar sticky stickyOffset={60}>
                                        <RichTextEditor.ControlsGroup>
                                            <RichTextEditor.Bold />
                                            <RichTextEditor.Italic />
                                            <RichTextEditor.Underline />
                                            <RichTextEditor.Strikethrough />
                                            <RichTextEditor.ClearFormatting />
                                            <RichTextEditor.Highlight />
                                            <RichTextEditor.Code />
                                        </RichTextEditor.ControlsGroup>

                                        <RichTextEditor.ControlsGroup>
                                            <RichTextEditor.H1 />
                                            <RichTextEditor.H2 />
                                            <RichTextEditor.H3 />
                                            <RichTextEditor.H4 />
                                        </RichTextEditor.ControlsGroup>

                                        <RichTextEditor.ControlsGroup>
                                            <RichTextEditor.Blockquote />
                                            <RichTextEditor.Hr />
                                            <RichTextEditor.BulletList />
                                            <RichTextEditor.OrderedList />
                                            <RichTextEditor.Subscript />
                                            <RichTextEditor.Superscript />
                                        </RichTextEditor.ControlsGroup>

                                        <RichTextEditor.ControlsGroup>
                                            <RichTextEditor.Link />
                                            <RichTextEditor.Unlink />
                                        </RichTextEditor.ControlsGroup>

                                        <RichTextEditor.ControlsGroup>
                                            <RichTextEditor.AlignLeft />
                                            <RichTextEditor.AlignCenter />
                                            <RichTextEditor.AlignJustify />
                                            <RichTextEditor.AlignRight />
                                        </RichTextEditor.ControlsGroup>

                                        <RichTextEditor.ControlsGroup>
                                            <RichTextEditor.Undo />
                                            <RichTextEditor.Redo />
                                        </RichTextEditor.ControlsGroup>
                                    </RichTextEditor.Toolbar>

                                    <RichTextEditor.Content />
                                </RichTextEditor> :
                                <div dangerouslySetInnerHTML={{ __html: description }} />
                            }</Grid.Col>
                            <Grid.Col span={1}>
                                {props.isAdmin ? IsEditDEs ?

                                    <Button type="submit" onClick={onSubmitEdit} color="#2CB5B5">Submit</Button>
                                    :
                                    <ActionIcon variant="subtle" color='black' aria-label="EditDes" onClick={() => setIsEditDes(true)}>
                                        <IconEdit style={{ width: '130%', height: '130%' }} stroke={1.5} />
                                    </ActionIcon> : <div></div>}
                            </Grid.Col>
                        </Grid>
                        <Divider my="md" />
                        <TableSection stid={params.id} isAdmin={props.isAdmin} />
                    </Stack>
                    <Modal opened={opened} onClose={() => handlers.close()} title="Edit image" centered>
                        <Stack>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={convertToBase64}
                            />
                            <Group justify="flex-end" mt="md">
                                <Button onClick={onUploadImage}>Upload</Button>
                            </Group>
                        </Stack>
                    </Modal>
                </Stack>}
        </AppShell.Main>
    );

}