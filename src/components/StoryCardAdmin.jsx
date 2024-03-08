import '@mantine/core/styles.css';
import { Button, Container, Group, Indicator, LoadingOverlay, Modal, Text} from '@mantine/core';
import StoryCard from './StoryCard';
import { useDisclosure, useHover } from '@mantine/hooks';
import { useState } from 'react';


export default function StoryCardAdmin(props) {

    const [loading, setLoading] = useState(false)
    const [opened, handlers] = useDisclosure(false);
    const { hovered, ref } = useHover();
    const urldeleteStory = `https://pj-backend.up.railway.app/stories/${props.stid}`

    const onSubmitDelete = () => {
        setLoading(true)
        const urldelete = urldeleteStory
        const requestOptions = {
            method: 'DELETE',
        };
        fetch(urldelete, requestOptions)
            .then(response => response.json())
            .then(data => {console.log(data); setLoading(false); handlers.close();})
            .catch(e => console.log(e))

    }
    return (
        <Indicator color="red"  label="!" size={20} disabled={!props.rq}>
        <div ref={ref}>
            <StoryCard id={props.stid} category={props.category}title={props.title} description={props.description} 
            Ep={props.Ep.length} image={props.image} isAdmin={true} isPublish={props.isPublish}></StoryCard>
            <Modal opened={opened} onClose={handlers.close} title="Are you sure delete this question?" centered>
            <LoadingOverlay visible={loading} loaderProps={{ children: 'Loading...' }} />
                <Text size='xs'>If you delete the question you can’t recover it.</Text>
                <Group justify="flex-end" mt="md">
                    <Button variant="outline"  color="#FF6666" onClick={handlers.close}>Cancle</Button>
                    <Button type="submit"  color="#FF6666" onClick={onSubmitDelete}>Delete</Button>
                </Group>
            </Modal>
            {hovered ?
            <Container py="sm">
                <Button variant="outline" onClick={handlers.open} color="#FF6666" fullWidth >
                    Delete
                </Button>
            </Container> : <div></div>}
        </div>
        </Indicator>
    );

}