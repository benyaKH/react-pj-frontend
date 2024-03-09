import '@mantine/core/styles.css';

import { AppShell, Card, rem, Stack, Text, Button} from '@mantine/core';
import { useGoogleLogin,googleLogout } from '@react-oauth/google';
import { useState,useEffect } from 'react';
import axios from 'axios';

export default function LoginPage() {

    const [user, setUser] = useState([]);
    const [name] = useState(() => {
        return localStorage.getItem('username')
      })

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        console.log(res);
                        localStorage.setItem("username", res.data.id);
                        window.location.replace(`/`)
                    })
                    .catch((err) => console.log(err));
            }
        },
        [user]
    );

    const logOut = () => {
        googleLogout();
        localStorage.removeItem("username")
    };


    // useEffect(() => {
    //     const intitClient = () => {
    //         gapi.client.init({
    //             clientId: clientId,
    //             scope: ''
    //         })
    //     }
    //     gapi.load("client:auth2", intitClient)
    // }, [])


    return (
        <AppShell.Main>
            <Stack align="center" py={rem(100)} >
                <Card shadow="sm" radius="md" withBorder >
                    <Card.Section bg="#521125">
                        <Text fw={500} px={rem(30)} py="lg" size={rem(40)} color='white'  >
                            Login page
                        </Text>
                    </Card.Section>
                    {name ? (
                        
                            <button onClick={logOut}>Log out</button>
                        
                    ) : (
                        <Button mx="30" mt="20" color="#521125" variant="outline" onClick={login}>Sign in with Google 🚀 </Button>
                    )}
                </Card>

            </Stack>
        </AppShell.Main>
    );

}