import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import { auth, db } from '../firebase'
import { useRouter } from 'next/router'
import { Avatar, IconButton } from '@mui/material'
import { AttachFile, InsertEmoticon, Mic, MoreVert } from '@mui/icons-material'
import { useCollection } from 'react-firebase-hooks/firestore'
import Message from './Message'
import { useRef, useState } from 'react'
import firebase from 'firebase/compat/app'
import getRecipientEmail from '../utils/getRecipientEmail'
import TimeAgo from 'timeago-react'

function ChatScreen({ chat, messages }) {
	const [user] = useAuthState(auth)
	const [input, setInput] = useState('')
	const EndOfMessagesref = useRef(null)
	const router = useRouter()
	const [messagesSnapshot] = useCollection(
		db
			.collection('chats')
			.doc(router.query.id)
			.collection('messages')
			.orderBy('timestamp', 'asc')
	)

	const [recipientSnapshot] = useCollection(
		db
			.collection('users')
			.where('email', '==', getRecipientEmail(chat.users, user))
	)

	const scrollToBottom = () => {
		if (EndOfMessagesref.current) {
			EndOfMessagesref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}
	}

	const showMessages = () => {
		if (messagesSnapshot) {
			return messagesSnapshot.docs.map((message) => (
				<Message
					key={message.id}
					user={message.data().user}
					message={{
						...message.data(),
						timestamp: message.data().timestamp?.toDate().getTime(),
					}}
				/>
			))
		} else {
			return JSON.parse(messages).map((message) => (
				<Message key={message.id} user={message.user} message={message} />
			))
		}
	}

	const sendMessage = (e) => {
		e.preventDefault()

		db.collection('users').doc(user.uid).set(
			{
				lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
			},
			{ merge: true }
		)

		db.collection('chats').doc(router.query.id).collection('messages').add({
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			message: input,
			user: user.email,
			photoURL: user.photoURL,
		})

        scrollToBottom()
		setInput('')
	}

	const recipient = recipientSnapshot?.docs?.[0]?.data()
	const recipientEmail = getRecipientEmail(chat.users, user)

	return (
		<Container>
			<Header>
				{recipient ? (
					<Avatar src={recipient?.photoURL} />
				) : (
					<Avatar>{recipientEmail[0]}</Avatar>
				)}

				<HeaderInformation>
					<h3>{recipientEmail}</h3>
					{recipientSnapshot ? (
						<p>
							Last active:{' '}
							{recipient?.lastSeen?.toDate() ? (
								<TimeAgo datetime={recipient?.lastSeen?.toDate()} />
							) : (
								'Unavailable'
							)}
						</p>
					) : (
						<p>Loading Last Seen ...</p>
					)}
				</HeaderInformation>
				<HeaderIcons>
					<IconButton>
						<AttachFile />
					</IconButton>
					<IconButton>
						<MoreVert />
					</IconButton>
				</HeaderIcons>
			</Header>

			<MessageContainer>
				{showMessages()}
				<EndOfMessage ref={EndOfMessagesref} />
				{/* <EndOfMessage /> */}
			</MessageContainer>
			<InputContainer>
				<InsertEmoticon />
				<Input value={input} onChange={(e) => setInput(e.target.value)} />

				<button hidden disabled={!input} type="submit" onClick={sendMessage}>
					Send
				</button>
			</InputContainer>
		</Container>
	)
}
export default ChatScreen

const Container = styled.div`
    ::-webkit-scrollbar {
		display: none;
	}

	-ms-overflow-style: none;
	scrollbar-width: none;
`

const Header = styled.div`
	position: sticky;
	/* background-color: #18222d; */
	background-color: white;
	display: flex;
	align-items: center;
	z-index: 100;
	top: 0;
	padding: 11px;
	height: 80px;
	border-bottom: 1px solid whitesmoke;
`

const HeaderInformation = styled.div`
	margin-left: 15px;
	flex: 1;
	> h3 {
		margin-bottom: 3px;
	}

	> p {
		font-size: 14px;
		color: gray;
	}
`

const HeaderIcons = styled.div``

const MessageContainer = styled.div`
	padding: 30px;
	background-color: #e5ded8;
	min-height: 90vh;
`

// const EndOfMessages = styled.div``

const InputContainer = styled.form`
	display: flex;
	align-items: center;
	padding: 10px;
	position: sticky;
	bottom: 0;
	background-color: white;
	z-index: 100;
`
const Input = styled.input`
	flex: 1;
	outline: 0;
	border: transparent;
	border-radius: 10px;
	background-color: whitesmoke;
	padding: 20px;
	margin-left: 15px;
	margin-right: 15px;
	font-size: 16px;
`
const EndOfMessage = styled.div`

`