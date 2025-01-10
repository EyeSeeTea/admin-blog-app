import { Box, Button, Tab, Tabs, TextField, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import moment from "moment";

import i18n from "$/utils/i18n";
import { useEditPost } from "./useEditPost";
import { Maybe } from "$/utils/ts-utils";
import { Id } from "$/domain/entities/Ref";
import { Layout } from "$/webapp/components/layout/Layout";
import { IconButton } from "$/webapp/components/icon-button/IconButton";
import { Loader } from "$/webapp/components/loader/Loader";
import LoaderContainer from "$/webapp/components/loader/LoaderContainer";

const DATE_FORMAT = "DD MMMM YYYY";

export const EditPostPage: React.FC = React.memo(() => {
    const snackbar = useSnackbar();
    const { id } = useParams<{ id: Maybe<Id> }>();
    const {
        globalMessage,
        postState,
        handleStateChange,
        isImageLoading,
        handleImageUpload,
        handleRemoveImage,
        onSavePost,
        onClickCancel,
        errors,
        getErrorMessage,
    } = useEditPost(id);

    const [tabIndex, setTabIndex] = useState(0);

    useEffect(() => {
        if (!globalMessage) return;

        if (globalMessage?.type === "error") {
            snackbar.error(globalMessage.text);
        } else {
            snackbar.success(globalMessage?.text);
        }
    }, [globalMessage, snackbar]);

    const handleTabChange = useCallback((event: React.ChangeEvent<{}>, newValue: number) => {
        setTabIndex(newValue);
    }, []);

    const markdownComponents = useMemo(() => {
        return {
            p: ({
                children,
            }: React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLParagraphElement>,
                HTMLParagraphElement
            >) => (
                <Typography variant="body2" style={{ marginBottom: "0px" }}>
                    {children}
                </Typography>
            ),
            ul: ({
                children,
            }: React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLUListElement>,
                HTMLUListElement
            >) => <ul style={{ paddingLeft: "1.2em" }}>{children}</ul>,
            li: ({
                children,
            }: React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>) => (
                <li>
                    <Typography variant="body2">{children}</Typography>
                </li>
            ),
            a: ({ ...props }) => (
                <TextLink href={props.href} target="_blank" rel="noreferrer">
                    {props.children}
                </TextLink>
            ),
            img: ({ ...props }) => (
                <img
                    {...props}
                    src={props.src}
                    alt={props.alt}
                    style={{
                        width: "150px",
                        borderRadius: "10px",
                        margin: "20px 0",
                    }}
                />
            ),
        };
    }, []);

    return (
        <Layout title={id ? i18n.t("Edit post") : i18n.t("Create post")}>
            {postState.kind !== "loaded" ? (
                <Loader />
            ) : (
                <PostContainer>
                    {postState.data.id && (
                        <>
                            <TextDate>
                                {i18n.t("Created at: {{createdDate}}", {
                                    createdDate: moment(postState.data.createdDate).format(
                                        DATE_FORMAT
                                    ),
                                    nsSeparator: false,
                                })}
                            </TextDate>
                            <TextDate>
                                {i18n.t("Last updated: {{updatedDate}}", {
                                    updatedDate: moment(postState.data.updatedDate).format(
                                        DATE_FORMAT
                                    ),
                                    nsSeparator: false,
                                })}
                            </TextDate>
                        </>
                    )}

                    <FieldContainer>
                        <TextField
                            fullWidth
                            label={i18n.t("Title")}
                            variant="outlined"
                            margin="normal"
                            value={postState.data.title}
                            onChange={e => handleStateChange("title", e.target.value)}
                            error={errors.some(e => e.property === "title")}
                        />

                        <ErrorText>{getErrorMessage("title")}</ErrorText>
                    </FieldContainer>

                    <FieldContainer>
                        <TextField
                            fullWidth
                            label={i18n.t("Description")}
                            variant="outlined"
                            margin="normal"
                            multiline
                            minRows={3}
                            value={postState.data.description}
                            onChange={e => handleStateChange("description", e.target.value)}
                            error={errors.some(e => e.property === "description")}
                        />

                        <ErrorText>{getErrorMessage("description")}</ErrorText>
                    </FieldContainer>

                    <LoaderContainer loading={isImageLoading}>
                        <FieldContainer>
                            <Box mt={2}>
                                {postState.data.imageUrl ? (
                                    <ImageContainer>
                                        <IconButton
                                            className="remove-file"
                                            icon={<CloseIcon />}
                                            ariaLabel="Delete current image"
                                            onClick={handleRemoveImage}
                                        />

                                        <Image src={postState.data.imageUrl} alt="Post image" />

                                        <ErrorText>{getErrorMessage("imageUrl")}</ErrorText>
                                    </ImageContainer>
                                ) : (
                                    <UploadButtonContainer>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            component="label"
                                        >
                                            {i18n.t("Upload image")}
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                        </Button>

                                        <ErrorText>{getErrorMessage("imageUrl")}</ErrorText>
                                    </UploadButtonContainer>
                                )}
                            </Box>
                        </FieldContainer>
                    </LoaderContainer>

                    <FieldContainer>
                        <Tabs
                            value={tabIndex}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                        >
                            <Tab label={i18n.t("Write")} style={{ color: "black" }} />

                            <Tab label={i18n.t("Preview")} style={{ color: "black" }} />
                        </Tabs>

                        <Box mt={2}>
                            {tabIndex === 0 && (
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    value={postState.data.content}
                                    onChange={e => handleStateChange("content", e.target.value)}
                                    minRows={10}
                                />
                            )}

                            {tabIndex === 1 && (
                                <Box p={2} border={1} borderColor="#0000003b" borderRadius={4}>
                                    <ReactMarkdown components={markdownComponents}>
                                        {postState.data.content}
                                    </ReactMarkdown>
                                </Box>
                            )}
                        </Box>

                        <ErrorText>{getErrorMessage("content")}</ErrorText>
                    </FieldContainer>

                    <ButtonContainer>
                        <StyledButton
                            aria-label="Save post"
                            variant="contained"
                            color="primary"
                            onClick={onSavePost}
                        >
                            <Typography>{i18n.t("Save")}</Typography>
                        </StyledButton>

                        <StyledButton
                            aria-label="Cancel"
                            variant="contained"
                            onClick={onClickCancel}
                        >
                            <Typography>{i18n.t("Cancel")}</Typography>
                        </StyledButton>
                    </ButtonContainer>
                </PostContainer>
            )}
        </Layout>
    );
});

const PostContainer = styled.div`
    padding-block-start: 64px;
    padding-block-end: 32px;
    padding-inline: 64px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 16px;
`;

const FieldContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const UploadButtonContainer = styled.div`
    display: flex;
    flex-direction: column;

    .MuiButton-root {
        border-radius: 20px;
        height: 50px;
        text-transform: none;
        padding: 16px 24px;
        max-width: 200px;
    }
`;

const TextLink = styled.a`
    color: ${props => props.theme.palette.primary.main};

    text-transform: none;
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;

const TextDate = styled(Typography)`
    margin-block-end: 16px;
    font-weight: normal;
`;

const ErrorText = styled(Typography)`
    margin-block-start: 4px;
    font-weight: normal;
    color: ${props => props.theme.palette.error.main};
`;

const Image = styled.img<{ $fullWidth?: boolean }>`
    width: 100%;
    max-height: 250px;
    object-fit: contain;
    margin-block-end: 30px;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 16px;
    margin-block-start: 20px;
`;

const StyledButton = styled(Button)`
    &.MuiButton-root {
        border-radius: 20px;
        height: 50px;
        text-transform: none;
        padding: 16px 24px;
        max-width: 200px;
    }
`;

const ImageContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-block-start: 20px;
    border-radius: 4px;
    border: 1px solid #0000003b;

    .remove-file {
        align-self: flex-end;
        margin-block-start: 10px;
        margin-inline-end: 10px;
    }
`;
