import React from 'react';
import { Card, Text, MantineTheme, Image, Title} from '@mantine/core';
import { ThemeContext } from '@emotion/react';

const ExplainCard = (props) => {
    const { title, src, text } = props;
    const imageWidth = 360;
    const imageHeight = 260;
    return (
        <Card mt={30} withBorder={false} shadow="xs" padding="md" w={imageWidth} bg="transparent">
            <Card.Section mt="sm" style={{
                textAlign: "center",
            }}>
                <Title order={3} c="custom-orange.1">{title}</Title>
            </Card.Section>
            <Card.Section mt="sm" style={{}}>
                <Image width={imageWidth} height={imageHeight} radius={24} src={src}></Image>
            </Card.Section>
            <Card.Section mt="sm">
                <Text align="center" size="md" c="white.0">{text}</Text>
            </Card.Section>
        </Card>
    );
};

export default ExplainCard;