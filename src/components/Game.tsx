import React from 'react'
import { Flex, Typography, Result, Button, Divider, Space, Rate } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUsername, getDeck, drawnCard, getResult, restart, saveGame, fetchGame, getScore, getLives } from '../slices/gameSlice';
import kitten from '../assets/kitten.png'
import { HeartFilled } from '@ant-design/icons';

export default function Game() {
  const username = useSelector(getUsername);
  const deck = useSelector(getDeck);
  const result = useSelector(getResult);
  const score = useSelector(getScore);
  const lives = useSelector(getLives)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // remove below one data is persisted
  React.useEffect(() => {
    !username && navigate('/')
    dispatch(fetchGame())
  }, [])

  // TODO: if defusedCardCount is equal or more than deck's length then its already a win!

  return (
    <div className='game-page'>
      {deck.length > 0 ? (
        <>
          <Typography.Title level={3}>Hey, {username}!</Typography.Title>
          <Typography.Paragraph>Welcome to the game, click on a card to draw it!</Typography.Paragraph>
          <Typography.Paragraph>Games won till now: {score}</Typography.Paragraph>
          <Rate disabled value={lives} count={3} character={<HeartFilled />} />
          <Divider />
          <Flex justify='space-between'>
            {deck.map((payload: any) => (
              <img
                key={payload.id}
                alt='card'
                src={kitten}
                onClick={() => {
                  dispatch(drawnCard(payload))
                  dispatch(saveGame())
                }}
              />
            ))}
          </Flex>
          <Divider />
          <Button type='dashed' onClick={() => navigate('/')}>End Game</Button>
        </>
      ) : !!result && (
        <Result
          status={result === 'lost' ? 'error' : 'success'}
          title={result === 'lost' ? 'Oops, You lost!' : "Awesome, You've won!"}
          subTitle='Click to play again!'
          extra={(
            <Space>
              <Button onClick={() => dispatch(restart())}>Restart</Button>
              <Button onClick={() => navigate('/')}>Go Back</Button>
            </Space>
          )}
        />
      )}
    </div>
  );
}
