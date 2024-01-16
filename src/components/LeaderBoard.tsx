import { List } from 'antd';
import { useSelector } from 'react-redux';
import { getLeaderBoard } from '../slices/gameSlice';

export default function LeaderBoard () {
    const leaderboard = useSelector(getLeaderBoard)
    return (
        <List
            bordered
            size='small'
            header='Leader Board'
            style={{marginTop: '1rem'}}
            dataSource={leaderboard}
            renderItem={(item: any) => <List.Item>{item.username}: {item.score}</List.Item>}
        />
    )
}