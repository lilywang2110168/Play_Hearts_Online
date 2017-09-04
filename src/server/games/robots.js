// Place all of your robot (AI) logic here.  We want to make sure we understand what you have done.
// - Provide a simple interface for your AI module and export it

function selectCards(cards, num) {
    return  cards.slice(0, num);
}

function selectOne(game,cards, suit) {
    let answer=[];

    let notHeartCard=cards[0];

        for(let i=0; i<cards.length;i++){
            if(!game.state[0].breakHearts && cards[i].suit!='hearts'){
                notHeartCard=cards[i];
            }
            if(cards[i].suit==suit){
                answer.push(cards[i]);
                return answer;
            }
        }
        answer.push(notHeartCard);
        return answer;
}


module.exports = {
    selectCards:     selectCards,
    selectOne: selectOne
};