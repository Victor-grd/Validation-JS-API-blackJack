fetch('./cards.json').then( (response) => {
    response.json().then( (data) => {        
        let JsonData = data.cards
        let deck_player = []
        let deck_dealer = []
        indiceCount = 0;

        function run() {
            play()
            displayScore("dealer")
            displayScore("player")
            calcProba()
            getDeck('player')

        }

        function sendCard(cardRandom, target, showCard = true){

            let card = document.createElement('DIV');
            let symbole = document.createElement('IMG');
            let name = document.createElement('H1');
            let name2 = document.createElement('H1');
            
            card.setAttribute('value', cardRandom.valueBJ)
            name.innerHTML = cardRandom.card
            name2.innerHTML = cardRandom.card
            if (cardRandom.symbole == "Diamond") {
                symbole.src = "./img/Diamond.png";
                card.classList.add('red');
                name.classList.add('red');
                symbole.classList.add('red');
                name2.classList.add('red');
            }else if (cardRandom.symbole == "Heart"){
                symbole.src = "./img/Heart.png";
                card.classList.add('red');
                name.classList.add('red');
                symbole.classList.add('red');
                name2.classList.add('red');
            }else if (cardRandom.symbole == "Club"){
                symbole.src = "./img/Club.png";
                card.classList.add('black');
                name.classList.add('black');
                symbole.classList.add('black');
                name2.classList.add('black');
            }else if (cardRandom.symbole == "Spade"){
                symbole.src = "./img/Spade.png";
                card.classList.add('black');
                name.classList.add('black');
                symbole.classList.add('black');
                name2.classList.add('black');
            };

            card.appendChild(name);
            card.appendChild(symbole);
            card.appendChild(name2);

            card.classList.add('card');
            name.classList.add('name');
            symbole.classList.add('symbole');
            name2.classList.add('name2');

            if (showCard == false) {
                card.classList.add('hiddenCard');
            }

            let deck = document.querySelector('.deck__' + target);
            let countDeck = deck.childElementCount;
            card.style.left = (countDeck * 30) + "px";
            // deck.style.right = (countDeck * 30) + "px";

            document.querySelector('.deck__' + target).style.width = 100 + countDeck * 30 + "px"
            document.querySelector('.deck__' + target + '--2').style.width = 100 + countDeck * 30 + "px"


            card_2 = card.cloneNode(true)
            
            document.querySelector('.deck__' + target + '--2').appendChild(card_2);
            document.querySelector('.deck__' + target).appendChild(card);
        }

        function deleteCard(){
            var x = document.querySelectorAll('.card');
            for (y = 0; y < x.length; y++) {
                x[y].remove();
            }
        }

        function play() {
            oneMoreCard("dealer")
            oneMoreCard("player")
            oneMoreCard("dealer", false)
            oneMoreCard("player")
        }

        function displayScore(target, total) {
            var total = getScore(target);
            document.querySelector('.total__' + target).innerHTML = "Total : " + total
            document.querySelector('.total__' + target + '--2').innerHTML = "Total : " + total

        }

        function getScore(target){
            let total = 0;
            let cardsTarget = document.querySelector('.deck__' + target ).childNodes
            cardsTarget.forEach(element => {
                if (!element.classList.contains('hiddenCard')) {
                    total = total + parseInt(element.getAttribute('value'));
                }
            });
            
            return total;
        }

        function getDeck(target){
            if (target === 'player') {
                return deck_player
            } else if (target === 'dealer') {
                return deck_dealer
            }  
        }
        
        function shuffleCard() {
            indiceCount = 0;
            fetch('./cards.json').then( (response) => {
                response.json().then( (data) => {
                    console.log(data);
                    JsonData = data.cards
                })
            })
        }

        function oneMoreCard(target, showCard = true) {
            let Random = Math.floor(Math.random() * JsonData.length);
            var cardRandom = JsonData[Random];
            if (target === 'player') {
                deck_player.push(cardRandom)
            } else if (target === 'dealer') {
                deck_dealer.push(cardRandom)
            }
   
            sendCard(cardRandom, target, showCard)
            JsonData.splice(Random, 1);
            displayScore(target)
            if (showCard) {
                countCard(cardRandom)
            }  
            calcProba();
            
            if (target == "player") {
                deck_player.forEach(element => {
                    if (getScore("player") > 21 && element.card == 'A') {
                        document.querySelector('.deck__player > div[value="11"]').setAttribute('value', '1')
                        displayScore(target)
                        document.querySelector('.oneMoreCard').disabled = false
                    }  
                })
            } else if (target == "dealer") {
                deck_dealer.forEach(element => {
                    if (getScore("dealer") > 21 && element.card == 'A') {
                        document.querySelector('.deck__dealer > div[value="11"]').setAttribute('value', '1')
                        displayScore(target)
                    }  
                })
            }

            if (getScore("player") >= 21 ) {
                document.querySelector('.oneMoreCard').disabled = true
            }   
        }

        function stop() {
            document.querySelector(".deck__dealer .hiddenCard").classList.remove('hiddenCard')
            document.querySelector(".deck__dealer--2 .hiddenCard").classList.remove('hiddenCard')
            displayScore("dealer")
            let i = getScore('dealer');              
            countCard(deck_dealer[1])
            for (i = getScore("dealer"); i < 17;) {
                oneMoreCard("dealer");
                i = getScore("dealer")
            }
            document.querySelector('.oneMoreCard').disabled = true
            document.querySelector('.stopGame').disabled = true

            

        }

        function replay() {
            document.querySelector('.oneMoreCard').disabled = false
            document.querySelector('.stopGame').disabled = false
            deck_player = []
            deck_dealer = []
            console.log(JsonData);
            deleteCard();
            displayScore('player')
            displayScore('dealer')
            play()
            if (JsonData.length <= 5) {
                shuffleCard();
            }
        }

        function calcProba(){
            var cards = JsonData;
            let x = 0
            let y = 0

            cards.forEach(element => {
                if (element.valueBJ === 10) {
                    x++
                } else {
                    y++
                }
            });
            document.querySelector('.probaA').innerHTML = "autre : " + (y * 100 / JsonData.length).toFixed(2) + " %"
            document.querySelector('.probaB').innerHTML = "buche : " + (x * 100 / JsonData.length).toFixed(2) + " %"
            
        }

        function countCard(card) {
            let cards = card.card
            let plus = ['2', '3', '4', '5', '6']
            let moins = ['10', 'J', 'Q', 'K', 'A']

            if (plus.includes(cards)) {
                indiceCount++
            } else if (moins.includes(cards)) {
                indiceCount--
            }
            document.querySelector('.indice').innerHTML = 'indice : ' + indiceCount
        }

        run()

        document.querySelector('.oneMoreCard').addEventListener('click', () => {
            oneMoreCard("player")
            displayScore("player")
        })

        document.querySelector('.stopGame').addEventListener('click', () => {
            stop()
        })

        document.querySelector('.conseil').addEventListener('click', () => {
            document.querySelector('.modal-conseil').classList.remove('hiddenModal')
        })

        document.querySelector('.close-conseil').addEventListener('click', () => {
            document.querySelector('.modal-conseil').classList.add('hiddenModal')
        })

        document.querySelector('.replay').addEventListener('click', () => {
            replay()
        })

    }) 
})


document.querySelector('.close-choice').addEventListener('click', () => {
    document.querySelector('.secteur__choice').classList.toggle('secteur__choice--close')
})