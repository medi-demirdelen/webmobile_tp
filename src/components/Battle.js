import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { StatsContext } from "../App";

function Battle({stats}) {

    const navigate = useNavigate();
    const {id} = useParams();

    const [playerHP, setPlayerHP] = React.useState(stats['player']['hp']);
    const [enemyHP, setEnemyHP] = React.useState(stats['enemies'][id]['hp']);
    const [message, setMessage] = React.useState([]);
    const [xpIsGained, setXpIsGained] = React.useState(false);
    const [battleFinished, setBattleFinished] = React.useState(false);
    const [showCommands, setCommands] = React.useState(false);
    const [showItems, setItems] = React.useState(false);

    const [statsValue, setStatsValue] = React.useContext(StatsContext);

    function toHome() {
        navigate("/");
    }

    function playerAttack(damage) {
        if(enemyHP - damage >= 0) {
            setEnemyHP(hp => hp - damage);
        } else {
            setEnemyHP(hp => hp * 0);
        }
        setMessage( arr => [...arr, `Attaque du joueur(${damage} de dégâts)`]);
    }

    function enemyAttack(damage) {
        if(playerHP - damage >= 0) {
            setPlayerHP(hp => hp - damage);
        } else {
            setPlayerHP(hp => hp * 0);
        }
        setMessage( arr => [...arr, `Attaque de l'ennemi(${damage} de dégâts)`]);
    }

    function processBattle() {
        setItems(false);
        if(playerHP !== 0 && enemyHP !== 0 && !battleFinished) {
            playerAttack(stats['player']['atk'] + (statsValue.level-1));
            enemyAttack(stats['enemies'][id]['atk'] - (stats['player']['def'] + (statsValue.level-1)));   
        }
    }

    function activatePotion() {
        healPlayer(10);
        enemyAttack(stats['enemies'][id]['atk']);
    }

    function healPlayer(hp) {
        if(playerHP + hp > stats['player']['hp']) {
            setPlayerHP(stats['player']['hp']);
        } else {
            setPlayerHP(playerHP + hp);
        }
        setMessage( arr => [...arr, `Potion utilisée: soin de ${hp}`]);
    }

    React.useEffect(() => {
        if(playerHP === 0 || enemyHP === 0) {
            setBattleFinished(true);

            function getXP(xp, moneyYield) {
                setStatsValue({
                    ...statsValue,
                    exp: statsValue.exp + xp,
                    level: Math.floor(((statsValue.exp+1)/6))+1,
                    money: statsValue.money + moneyYield,
                });
            }

            if(!xpIsGained) {
                getXP(stats['enemies'][id]['exp'], stats['enemies'][id]['money']);
                setXpIsGained(true);
            } 
        }
    }, [playerHP, enemyHP, id, stats, setStatsValue, statsValue, xpIsGained]);

    return (
        <div className="BattleBlock">
            <div className="BattleGeneralInfo">
                <div className="PlayerInfo">
                    <div className="BlockTitle">
                        { stats['player']['name'] }
                    </div>
                    <div className="HPLine">
                        { playerHP+"/"+stats['player']['hp']+"HP" }
                    </div>
                </div> 
                <div className="EnemyInfo">
                    <div className="BlockTitle">
                        { stats['enemies'][id]['name'] }
                    </div>
                    <div className="HPLine">
                        { enemyHP+"/"+stats['enemies'][id]['hp']+"HP" } 
                    </div>
                </div>
            </div>
            <div className="Category" onClick={() => {
                setCommands(!showCommands);
            }}>
                Commandes    
            </div>
            {
                showCommands &&
                <div className="CommandsMenu">
                    <div className="SubCategory" onClick={() => {
                        processBattle();
                    }}>
                        Attaque
                    </div>
                    <div className="SubCategory" onClick={() => {
                        setItems(!showItems);
                    }}>
                        Objets
                    </div>
                    <div className="SubCategory" onClick={() => {
                        toHome();
                    }}>
                        Fuir
                    </div>
                </div>
            }
            {
                showItems &&
                <div className="ItemsMenu">
                    <div className="Category">
                        Objets
                    </div>
                    <div className="Item" onClick={() => {
                        activatePotion();
                    }}>
                        Potion
                    </div>
                    <div className="Item">
                        Bombe (non implémentée)
                    </div>
                    <hr/>
                </div>
            }
            {
                battleFinished &&
                <div className="BattleFinishedPrompt">
                    {
                        enemyHP === 0 &&
                        <span>L'{stats['enemies'][id]['name']} a été vaincu! +{stats['enemies'][id]['exp']}XP</span>
                    }<br/>
                    <Link to="/">Retour à l'écran de départ</Link>
                </div>
            }
            <div className="Message"> 
                {
                    message.map((value, index) => {
                        return ( <div>{value}<br/></div> )
                    })
                }
            </div>
        </div>

    );
}

export default Battle;