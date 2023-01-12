import React from 'react';
import { useNavigate } from "react-router-dom";
import { StatsContext } from "../App";

function Home({stats}) {

    const navigate = useNavigate();
    const [showStatus, setStatus] = React.useState(false);
    const [showEnemy, setEnemy] = React.useState(false);

    // eslint-disable-next-line no-unused-vars
    const [statsValue, setStatsValue] = React.useContext(StatsContext);

    function goToBattle(enemyId) {
        navigate("/battle/"+enemyId);
    }

    return (
        <div className="Home">
            <div className="Category" onClick={() => {
                setEnemy(!showEnemy);
            }}>
                Combattre
            </div>
            {
                showEnemy &&
                <div className="EnemyCategory">
                    <div className="SubCategory" onClick={() => {
                        goToBattle(1);
                    }}>
                        Ennemi #1
                    </div>
                    <div className="SubCategory" onClick={() => {
                        goToBattle(2);
                    }}>
                        Ennemi #2
                    </div>
                </div>
            }
            <div className="Category" onClick={() => {
                setStatus(!showStatus);
            }}>
                Status
            </div>
            {
                showStatus && 
                <div className="Status">
                    { "Niveau : " + Math.floor(((statsValue.exp+1)/6))+1 }<br/>
                    { "EXP : " + statsValue.exp}<br/>
                    { "HP : " + (stats['player']['hp'] + (2 * ((Math.floor(((statsValue.exp+1)/6))+1) -1)) )}<br/>
                    { "Atk : " + (stats['player']['atk'] +((Math.floor(((statsValue.exp+1)/6))+1) -1) )}<br/>
                    { "Def : " + (stats['player']['def'] +((Math.floor(((statsValue.exp+1)/6))+1) -1) )}
                </div>
            }
        </div>
    );
}

export default Home;