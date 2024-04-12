import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import Divider from '@mui/material/Divider';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Fab from '@mui/material/Fab';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import React from 'react'

function ChatDialog() {

    const [clickChatBox, setClickChatBox] = React.useState(false);

    const hanndleChatBox = () => {
        setClickChatBox(!clickChatBox)
    }
    const Chatbox = () => (
        <Collapse
            in={clickChatBox}
            timeout="auto"
            unmountOnExit
        >
            <Box
                height={300}
                width={250}
                position='fixed'
                bottom={140}
                right={40}
                borderRadius={3}
            >
                <Card sx={{ maxWidth: 350, height: "100%" }}>
                    <CardHeader
                        sx={{
                            height: 50,
                        }}
                        avatar={
                            <Avatar
                                src='https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-1/373318937_1055633735434248_7085612218798261286_n.jpg?stp=c66.0.320.320a_dst-jpg_p320x320&_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHLhiTOJ4xkj6n73g-4s36BPNrBnWxik2s82sGdbGKTa6gSNfI1CRgzqPg-YohAQj_8oqoLYqGqgnv8c7A7L7PP&_nc_ohc=bVBm4e3OvWUAX8pnxDM&_nc_ht=scontent.fhan2-4.fna&oh=00_AfD6knI9mXB0Zp7Xmu0sQr81m79hv9pbObsJHhHUNwYwGg&oe=660400F9'
                                sx={{ bgcolor: 'red' }}
                                aria-label="recipe">

                            </Avatar>
                        }
                        action={
                            <IconButton
                                sx={{
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onClick={hanndleChatBox}
                                aria-label="settings"
                            >
                                <RemoveOutlinedIcon />
                            </IconButton>
                        }
                    />
                    <Divider />
                    <CardContent sx={{
                        height: 200,
                        maxHeight: 200
                    }}>
                        <Typography gutterBottom variant="h5" component="div">
                            Lizard
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Lizards are a widespread group of squamate reptiles, with over 6,000
                            species, ranging across all continents except Antarctica
                        </Typography>
                    </CardContent>
                    <CardActions
                        sx={{
                            maxHeight: 50,
                        }}
                    >
                        <TextField
                            hiddenLabel
                            id="filled-hidden-label-small"
                            variant="standard"
                            size="small"
                        />
                        <IconButton>
                            <SendIcon />
                        </IconButton>
                    </CardActions>
                </Card>
            </Box>
        </Collapse>

    )

  return (
      <div>
          <Box
              position='fixed'
              bottom={80}
              right={80}
              width={50}
              height={50}
              onClick={hanndleChatBox}
          >
              <Fab
                  variant="extended"
                  size="medium"
                  color="primary"
                  onClick={hanndleChatBox}
              >
                  <ChatBubbleOutlinedIcon sx={{ mr: 1 }} />
                  Chat
              </Fab>
          </Box>
          <Chatbox />  
        </div>
  )
}

export default ChatDialog