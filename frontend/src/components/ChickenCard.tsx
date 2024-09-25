import React, { useState } from 'react';
import { Card, Text, Image, Title, useMantineTheme, Space, Modal, Button, Group} from '@mantine/core';
import RoundButton from './RoundButton';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { executeTx } from '../data/tx';
import { COCKFIGHT_MODULE_ADDRESS } from '../lib/consts';

const imageWidth = 550;
const cardHeight = 620;
const imageHeight = 360;

const ChickenCard = (props: any ) => {
    const navigate = useNavigate()
    const { account, signAndSubmitTransaction } = useWallet()
    const { title, src, priceText, text, type, isFaded } = props;
    const [opened, setOpened] = useState(false);

    const handleClick = () => {
        executeTx(
            account,
            signAndSubmitTransaction,
            {
                data: {
                function: `${COCKFIGHT_MODULE_ADDRESS}::game::create_cockie`,
                functionArguments: [],
                }, 
            }
        )
    };

    return (
        <>
        <div style={{ position: 'relative', width: imageWidth, height: cardHeight }}>

        
            {isFaded && (
                <div
                    style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark transparent overlay
                    zIndex: 1, // Ensure it's above the card content
                    }}
                >
                    <Text
                    size="xl"
                    weight={700}
                    style={{ color: 'white', fontSize: '3rem', letterSpacing: '0.1em' }}
                    >
                    TBA
                    </Text>
                </div>
            )}
            <Card 
                radius={24} 
                withBorder={false} 
                shadow="xs" 
                padding="md" 
                w={imageWidth} 
                bg="dark-grey.0" 
                mih={500}
                style={{
                    flexDirection: 'column',
                    display: 'flex',
                    opacity: isFaded ? 0.5 : 1,  // Apply faded effect conditionally
                    transition: 'opacity 0.3s ease',  // Optional smooth transition
                }}
            >
                <Card.Section mt="sm">
                    <Image width={imageWidth} height={imageHeight} src={src}></Image>
                </Card.Section>
                <Card.Section  mt="0" p={20} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: "1 0 auto",
                }}>
                    <Title p="0 0 10px" order={3} c={"white.0"} mb={4} style={{ textAlign: "start" }}>
                        {title}
                    </Title>
                    <Title size="md" c="white.0" order={4} mb={12} style={{ textAlign: "start" }}>
                        {priceText}
                    </Title>
                    <Text size="md" c="grey.0">{text}</Text>
                    <Space style={{ flex: "1 0 auto" }}></Space>
                    <RoundButton 
                        text="BUY NOW" size="lg" mt={20} variant="filled" bgColor="custom-orange.1" textColor={"black"} fullWidth 
                        onClick={() => setOpened(true)}
                    />
                </Card.Section>
            </Card>
            </div>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Confirm Purchase"
                centered
                overlayColor={"rgba(0, 0, 0, 0.75)"}
                overlayBlur={3}
                styles={{
                    modal: {
                        backgroundColor: '#1A1B1E',
                        padding: '20px',
                        borderRadius: '24px',
                        color: 'white',
                    },
                    title: {
                        color: 'white',
                        marginBottom: '16px',
                    },
                    body: {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    },
                }}
            >
                <Text size="md" c="grey.0" mb={20}>Are you sure you want to buy this item?</Text>
                <Group position="center">
                    <Button onClick={() => {
                        handleClick();
                        setOpened(false);
                    }}>
                        Confirm
                    </Button>
                    <Button variant="outline" color="gray" onClick={() => setOpened(false)} style={{ marginRight: '10px' }}>
                        Cancel
                    </Button>
                </Group>
            </Modal>
        </>
    );
};

export default ChickenCard;