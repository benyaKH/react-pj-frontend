import '@mantine/core/styles.css';
import { Card, Image, Text, Group, Badge, Grid, BackgroundImage, Box } from '@mantine/core';

export default function StoryCard(props) {
    const urlherf = () => {
        if (props.isAdmin) {
            return `/Dashboard/${props.id}`
        } else return `/Story/${props.id}`
    }


    return (

        <Card
            shadow="sm"
            padding="xl"
            component="a"
            href={urlherf()}
            target="_blank"
            bg="#521125"
        >
            <Card.Section>

                {/* <Image
                    src={props.image == "" || props.image == null ?
                        "https://images.unsplash.com/photo-1579227114347-15d08fc37cae?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
                        : props.image}
                    h={160}
                    alt="No way!"
                /> */}
                <BackgroundImage
                    src={props.image == "" || props.image == null ?
                        "https://images.unsplash.com/photo-1579227114347-15d08fc37cae?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
                        : props.image}
                >
                    <Box h={160} >
                        {props.isAdmin &&
                            <Group justify='flex-end'>
                                <Badge m="md" color={props.isPublish ? "green" : "pink"}>{props.isPublish ? 'Published' : 'Unpublised'}</Badge>
                            </Group>
                        }
                    </Box>
                </BackgroundImage>

            </Card.Section>

            <Text fw={500} size="md"  mt="md" color='white'>
                {props.title}
            </Text>

            <Text mt="xs" size="sm" color='white'>
                {props.category}
            </Text>
            <Text mt="xs" size="xs" color='white'>
                {props.Ep} episodes
            </Text>
        </Card>


    );

}