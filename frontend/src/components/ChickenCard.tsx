import React, { useState } from 'react';
import { Card, Text, Image, Title, useMantineTheme, Space, Modal, Button, Group} from '@mantine/core';
import RoundButton from './RoundButton';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const imageWidth = 550;
const cardHeight = 620;
const imageHeight = 360;

const ChickenCard = (props: any ) => {
    // const [values, setValues] = useRecoilState()
    const navigate = useNavigate()

    const { title, src, priceText, text, type } = props;
    
    const [opened, setOpened] = useState(false);
    
    // const { mutate, isPending } = useMutation({
    //     mutationFn: async () => {
    //         if (!address) {
    //             alert('Please connect wallet')
    //             return
    //         }
            
    //         const metadata = computeCoinMetadata("0x1", "uinit")
    //         const msgs = [
    //             new MsgExecute(
    //             address,
    //             COCKFIGHT_MODULE_ADDRESS,
    //             COCKFIGHT_MODULE_NAME,
    //             "mint",
    //             [],
    //             [
    //                 bcs.object().serialize(metadata).toBase64(),
    //             ],
    //             ),
    //         ]

    //         await requestTx({ messages: toEncodeObject(msgs) })
            
    //         const body = {
    //             address,
    //             type,
    //             base_coin: "USDC",
    //             decimal: 8
    //         }
    //         try {
    //             const response = await axios.post(`${API_URL}/market/mint`, body);
    //             console.log('buy response: ', response, API_URL);
    //         } catch (error) {
    //             console.error('buy error: ', error);
    //         }

    //         return
    //     },
    //     onSuccess: (response) => {
    //       if (window.location.href.includes("confirm")) {
    //         navigate("../main")
    //       }
    //     },
    //     onError: (error) => {
    //       showTxNotification({ type: "failed", error: error as Error })
    //     },
    //   })

    const handleBuyNowClick = () => {
        setOpened(true);
    };

    return (
        <>
            <Card radius={24} withBorder={false} shadow="xs" padding="md" w={imageWidth} bg="dark-grey.0" mih={500} style={{
                flexDirection: 'column',
                display: 'flex'
            }}>
                <Card.Section mt="sm" style={{}}>
                    <Image width={imageWidth} height={imageHeight} src={src}></Image>
                </Card.Section>
                <Card.Section  mt="0" p={20} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: "1 0 auto",
                }}>
                    
                    <Title p="0 0 10px" order={3} c={"white.0"} mb={4} style={{
                        textAlign: "start",
                    }}>{title}</Title>
                    <Title size="md" c="white.0" order={4} mb={12} style={{
                        textAlign: "start",
                    }}>{priceText}</Title>
                    <Text size="md" c="grey.0">{text}</Text>
                    <Space style={{
                        flex: "1 0 auto"
                    }}></Space>
                    <RoundButton text="BUY NOW" size="lg" mt={20} variant="filled" bgColor="custom-orange.1" textColor={"black"} fullWidth></RoundButton>
                </Card.Section>
            </Card>

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
                        // onClickButton(type);
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