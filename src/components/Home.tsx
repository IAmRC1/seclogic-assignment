import React from 'react';
import { Typography, Input, Button, Space, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUsername, createDeck, getLeaderBoard, fetchLeaderBoard } from '../slices/gameSlice';
import LeaderBoard from './LeaderBoard';

export default function Home() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const leaderboard = useSelector(getLeaderBoard)

  const [value, setValue] = React.useState<string>('')
  const [showRulesModal, setShowRulesModal] = React.useState<boolean>(false)

  React.useEffect(() => {
    dispatch(fetchLeaderBoard())
  }, [])

  return (
    <div className='container'>
      <Typography.Title>exploding kittens!</Typography.Title>
      <Typography.Paragraph>Enter username to get started!</Typography.Paragraph>
      <Space.Compact>
        <Input
            placeholder='Eg. Kitten'
            value={value}
            onChange={({target: {value}}) => setValue(value)}
        />
        <Button
          type='primary'
          disabled={!value}
          onClick={() => {
            dispatch(setUsername(value))
            dispatch(createDeck())
            setShowRulesModal(true)
          }}
        >
          Start
        </Button>
      </Space.Compact>
      <Modal
        centered
        closable={false}
        title={leaderboard.some((user: any) => user.username === value) ? 'Welome back, old friend!' : 'Rules of the game!'}
        open={showRulesModal}
        onOk={() => navigate('/new')}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <p>If the card drawn from the deck is a cat card, then the card is removed from the deck.</p>
        <p>If the card is defusing card, then the card is removed from the deck. This card can be used to defuse one bomb that may come in subsequent cards drawn from the deck.</p>
        <p>If the card is a shuffle card, then the game is restarted and the deck is filled with 5 cards again.</p>
        <p>If the card is Exploding Kitten (bomb) then the player loses the game.</p>
        <h5>You win the game if you draw all the cards from the deck without explosion. Let's Play!</h5>
      </Modal>
      {leaderboard.length > 0 && <LeaderBoard />}
    </div>
  );
}