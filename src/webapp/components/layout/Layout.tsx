import React, { useCallback } from "react";
import styled from "styled-components";
import { Typography } from "@material-ui/core";

import whoLogoBlue from "$/webapp/assets/who-logo-blue.png";
import { AppFooter } from "./app-footer/AppFooter";

import { RouteName, useRoutes } from "$/webapp/hooks/useRoutes";

interface LayoutProps {
    children: React.ReactNode;
    title: string;
}

export const Layout: React.FC<LayoutProps> = React.memo(props => {
    const { title, children } = props;
    const { goTo } = useRoutes();

    const goToHome = useCallback(() => {
        goTo(RouteName.POSTS_LIST);
    }, [goTo]);

    return (
        <>
            <header>
                <LogoContainer>
                    <img src={whoLogoBlue} width={150} alt="WHO logo" onClick={goToHome} />
                </LogoContainer>
                <TitleContainer>
                    <Typography variant="h4">{title}</Typography>
                </TitleContainer>
            </header>

            <Main>{children}</Main>

            <footer>
                <AppFooter />
            </footer>
        </>
    );
});

const Main = styled.main`
    min-height: 100vh;
    background: white;
`;

const TitleContainer = styled.div`
    background: ${props => props.theme.palette.common.gradientPrimary};
    color: white;
    padding: 32px 64px;
`;

const LogoContainer = styled.div`
    margin: 10px 10px;
    img {
        cursor: pointer;
        padding-inline-start: 44px;
    }
`;
