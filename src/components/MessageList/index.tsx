import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { api } from '../../services/api';
import { io } from 'socket.io-client';

import { Message, MessageProps } from '../Message';

import { styles } from './styles';
import { FilterMessagesButton } from '../FilterMessagesButton';
import { useAuth } from '../../hooks/auth';

const TAG_HOME = 0;
const TAG_ME = 1;

let messagesQueue: MessageProps[] = [];

const socket = io(String(api.defaults.baseURL));
socket.on("new_message", (newMessage: MessageProps) => {
    messagesQueue.push(newMessage);
});

export function MessageList() {
    const { user } = useAuth();

    const [selectedButton, setSelectedButton] = useState(TAG_HOME);
    const [currentMessages, setCurrentMessages] = useState<MessageProps[]>([]);
    const [myMessages, setMyMessages] = useState<MessageProps[]>([]);

    useEffect(() => {
        if (!user) setSelectedButton(TAG_HOME);
    }, [user]);

    useEffect(() => {
        async function fetchMessages() {
            if (selectedButton == TAG_HOME) {
                const messageResponse = await api.get<MessageProps[]>('/messages/last3');
                setCurrentMessages(messageResponse.data);
            } else {
                const messageResponse = await api.get<MessageProps[]>('/messages/user/' + user?.id);
                setMyMessages(messageResponse.data);
            }
        }

        fetchMessages();
    }, [selectedButton]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (messagesQueue.length > 0) {
                setCurrentMessages(prevState => [
                    messagesQueue[0],
                    prevState[0],
                    prevState[1]
                ].filter(Boolean));
                messagesQueue.shift();
            }
        }, 3000);

        return () => clearInterval(timer);
    }, []);

    function handleFilterMessages(value: number) {
        if (selectedButton !== value) setSelectedButton(value);
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="never"
        >
            <View style={styles.filter}>
                {user &&
                    <>
                        <FilterMessagesButton
                            title="Últimas mensagens"
                            selected={selectedButton === TAG_HOME}
                            onPress={() => handleFilterMessages(TAG_HOME)}
                        />
                        <Text style={styles.filterDivider}>|</Text>
                        <FilterMessagesButton
                            title="Minhas mensagens"
                            selected={selectedButton === TAG_ME}
                            onPress={() => handleFilterMessages(TAG_ME)}
                        />
                    </>
                }

            </View>
            {selectedButton === TAG_HOME
                ? currentMessages.map((message) => <Message key={message.id} data={message} />)
                : myMessages.map((message) => <Message key={message.id} data={message} />)}

        </ScrollView>
    );
}