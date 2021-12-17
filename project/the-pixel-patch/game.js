
( function(){


'use strict';
        //sounds go here
        const ambiance = new Audio('mp3/ambiance.mp3'),
              tap = new Audio('mp3/tap.mp3'),
              fullgrownflower = new Audio('mp3/fullgrown.mp3'),
              plant = new Audio('mp3/plant.mp3'),
              click = new Audio('mp3/click.mp3');

            if (typeof ambiance.loop == 'boolean') {
                ambiance.loop = true;
            }
            else {
                ambiance.addEventListener('ended', function() {
                    this.currentTime = 0;
                    this.play();
                }, false);
            }       




        let speedX = 0;
        let speedY = 0;
        let dir = 'right';

        function panBackground() {
            ambiance.play()
            if(dir == 'right') {
                speedX -= .25;
            } else { 
                speedX += .25;
            }
            $('#cloudcover').css({'background-position': speedX+'px '+speedY+'px'});
            requestAnimationFrame(panBackground)
        }
        panBackground();
        


        function wait(ms=0){
            return new Promise( (resolve) => {
                setTimeout(resolve,ms)
            })
        }

        //populate the #grow-area with 10 equally sized plots of land

        const growArea = $('#grow-area'),
            items =['p1','p2','p3','p4','p5','p6','p7','p8','p9','p10'],
            theLength = items.length;

        // let plot = '';

        for(let i = 0; i < theLength; i++){
            let plot = $('<div>').attr('id', items[i]).addClass('plot').html('<div class="econ-ui" draggable="false"><p class="buy" draggable="false">Buy</p><p class="sell" draggable="false">Sell</p><div class="growth"><span></span></div>').attr('data-amt', 0).attr('data-goal', 0);

            growArea.append(plot)
        }

        //CODE FOR THE UI
        
        let playerCoins = '---'
        $('#player-coins p').text(playerCoins)
        let seconds = 0;
        let minutes = 0;
        let hours = 0;
        let currenttime= localStorage.getItem('currenttime');
        let totalClicks = localStorage.getItem('clicks');
        let bonusAmount;
        

        
       
        let howLong = setInterval( function (){
            currenttime++;
    
            var hours = Math.floor((currenttime/60)/60);
       
            var minutes = Math.floor((currenttime/60)%60);
                if(minutes < 10){
                minutes = '0'+minutes;
                
           }

            var seconds = currenttime%60;
                if(seconds < 10){
                seconds = '0'+seconds;
           
           }
       
    $('#universal-timer p').text(hours+':'+ minutes +':'+seconds)
    $('.total-clicks span').text(totalClicks)
    $('#player-coins p').text(playerCoins)
    $('.click-multiplier span').text(bonusAmount)

    populateStorage()
    
    }, 1000)//end timerTick()


    function populateStorage() {
        localStorage.setItem('currenttime', currenttime);
        localStorage.setItem('coins', playerCoins);
        localStorage.setItem('clicks', totalClicks);
    }
    playerCoins = localStorage.getItem('coins')

    if (playerCoins == null){
        playerCoins = 500*1
    }
    if (totalClicks == null){
        totalClicks = 0*1
    }


        
    $('#game-mode').on('click', function(){
        if($('#game-mode').hasClass('buy-mode')) {
            $('#game-mode').html('<img src="img/disabled.png"><p></p>')
            $('#game-mode p').text('Show Shop')
            $('.econ-ui').css({'visibility':'hidden'})
            $('.growth').css({'opacity':'40%'})
            $('#game-mode').removeClass('buy-mode')
            $('#game-mode').addClass('grow-mode')
        }
        else if ($('#game-mode').hasClass('grow-mode')){
            $('#game-mode').html('<img src="img/enabled.png"><p></p>')
            $('#game-mode p').text('Hide Shop')
            $('.econ-ui').css({'visibility':'visible'})
            $('.growth').css({'opacity':'100%'})
            $('#game-mode').removeClass('grow-mode')
            $('#game-mode').addClass('buy-mode')
            // if ($('.plot').hasClass('full-grown-daisy') || $('.plot').hasClass('full-grown-tulip')){
            //     $(this).find('.sell').css({'visibility':'visible'})
            // }
        }
    })

        // ------------------------------
        // ------------------------------

        // START PLANT PROPERTIES

        // ------------------------------
        // ------------------------------

// vvvvvvvvvvvvvvvvvvvvvvv DAISY STUFF vvvvvvvvvvvvvvvvvvvvvvvvvvvv


            function buyDaisy(ele){
                //figure out which plot was clicked
                //check to see if has plant
                //add plant when clicked
                var targetPlot = $(ele);

                if (!$(targetPlot).hasClass('planted')){
                    targetPlot.append('<div class="daisy"></div>')
                    targetPlot.addClass('planted')
                
                }
            }

            function daisyGrowth(ele){
                let flowerStage
                let goalAmt = $(ele).attr('data-goal');
                let amt = $(ele).attr('data-amt');
                let amtText = Math.round(amt/goalAmt*100)
                let growthText = $(ele).find('.growth span').css({'width' : amtText+'%'})

                if(amtText >= 100){
                    async function sellWait(){
                     flowerStage = 'url("img/daisyfull.png")';
                     await wait(1500)
                     $(ele).find('.sell').css({'visibility':'unset'})
                     fullgrownflower.play()
                    }
                    sellWait();
                 }else if(amtText <= 99 && amtText >= 66){
                     flowerStage = 'url("img/daisy3.png")';
                 }else if (amtText >= 35 && amtText < 66){
                     flowerStage = 'url("img/daisy2.png")';
                 } else if(amtText > 5 && amtText < 35 ) {
                     flowerStage = 'url("img/daisy1.png")';
                 }
                $(ele).children('.daisy').css({'background':flowerStage})
            }

// vvvvvvvvvvvvvvvvvvvvvvv TULIP STUFF vvvvvvvvvvvvvvvvvvvvvvvvvvvv

            function buyTulip(ele){
                //figure out which plot was clicked
                //check to see if has plant
                //add plant when clicked
                var targetPlot = $(ele);

                if (!$(targetPlot).hasClass('planted')){
                    targetPlot.append('<div class="tulip"></div>')
                    targetPlot.addClass('planted')
                }
            }

            function tulipGrowth(ele){
                let flowerStage
                let goalAmt = $(ele).attr('data-goal');
                let amt = $(ele).attr('data-amt');
                let amtText = Math.round(amt/goalAmt*100)
                let growthText = $(ele).find('span').css({'width' : amtText+'%'})

                if(amtText >= 100){
                    async function sellWait(){
                     flowerStage = 'url("img/tulipfull.png")';
                     await wait(1500)
                     $(ele).find('.sell').css({'visibility':'unset'})
                     fullgrownflower.play()
                    }
                    sellWait();
                 }else if(amtText <= 99 && amtText >= 66){
                     flowerStage = 'url("img/tulip3.png")';
                 }else if (amtText >= 35 && amtText < 66){
                     flowerStage = 'url("img/tulip2.png")';
                 } else if(amtText > 0 && amtText < 35 ) {
                     flowerStage = 'url("img/tulip1.png")';
                 }
                $(ele).children('.tulip').css({'background':flowerStage})
            }


//vvvvvvvvvvvvvvvvvvvvv LILAC STUFF vvvvvvvvvvvvvvvvvvvvvvvvvv

            function buyLilac(ele){
                //figure out which plot was clicked
                //check to see if has plant
                //add plant when clicked
                var targetPlot = $(ele);

                if (!$(targetPlot).hasClass('planted')){
                    targetPlot.append('<div class="lilac"></div>')
                    targetPlot.addClass('planted')
                }
            }

            function lilacGrowth(ele){
                let flowerStage
                let goalAmt = $(ele).attr('data-goal');
                let amt = $(ele).attr('data-amt');
                let amtText = Math.round(amt/goalAmt*100)
                let growthText = $(ele).find('span').css({'width' : amtText+'%'})

                if(amtText >= 100){
                    async function sellWait(){
                     flowerStage = 'url("img/lilacfull.png")';
                     await wait(1500)
                     $(ele).find('.sell').css({'visibility':'unset'})
                     fullgrownflower.play()
                    }
                    sellWait();
                 }else if(amtText <= 99 && amtText >= 66){
                     flowerStage = 'url("img/lilac3.png")';
                 }else if (amtText >= 35 && amtText < 66){
                     flowerStage = 'url("img/lilac2.png")';
                 } else if(amtText > 0 && amtText < 35 ) {
                     flowerStage = 'url("img/lilac1.png")';
                 }
                $(ele).children('.lilac').css({'background':flowerStage})
            }


//vvvvvvvvvvvvvvvvvvvvvv GARDENIA STUFF vvvvvvvvvvvvvvvvv

            function buyGardenia(ele){
                //figure out which plot was clicked
                //check to see if has plant
                //add plant when clicked
                var targetPlot = $(ele);

                if (!$(targetPlot).hasClass('planted')){
                    targetPlot.append('<div class="gardenia"></div>')
                    targetPlot.addClass('planted')
                }
            }

            function gardeniaGrowth(ele){
                let flowerStage
                let goalAmt = $(ele).attr('data-goal');
                let amt = $(ele).attr('data-amt');
                let amtText = Math.round(amt/goalAmt*100)
                let growthText = $(ele).find('span').css({'width' : amtText+'%'})

                if(amtText >= 100){
                    async function sellWait(){
                     flowerStage = 'url("img/gardeniafull.png")';
                     await wait(1500)
                     $(ele).find('.sell').css({'visibility':'unset'})
                     fullgrownflower.play()
                    }
                    sellWait();
                 }else if(amtText <= 99 && amtText >= 66){
                     flowerStage = 'url("img/gardenia3.png")';
                 }else if (amtText >= 35 && amtText < 66){
                     flowerStage = 'url("img/gardenia2.png")';
                 } else if(amtText > 0 && amtText < 35 ) {
                     flowerStage = 'url("img/gardenia1.png")';
                 }
                $(ele).children('.gardenia').css({'background':flowerStage})
            }

//vvvvvvvvvvvvvvvvvvvvvvvvvvvv PIRANHA STUFF vvvvvvvvvvvvvvvvvvvvvvvvvvvv

            function buyPiranha(ele){
                //figure out which plot was clicked
                //check to see if has plant
                //add plant when clicked
                var targetPlot = $(ele);

                if (!$(targetPlot).hasClass('planted')){
                    targetPlot.append('<div class="piranha"></div>')
                    targetPlot.addClass('planted')
                }
            }

            function piranhaGrowth(ele){
                let flowerStage
                let goalAmt = $(ele).attr('data-goal');
                let amt = $(ele).attr('data-amt');
                let amtText = Math.round(amt/goalAmt*100)
                let growthText = $(ele).find('span').css({'width' : amtText+'%'})

                if(amtText >= 100){
                    async function sellWait(){
                     flowerStage = 'url("img/piranhaanimated.png")';

                     upDown($(ele).children('.piranha'));


                     await wait(1500)
                     $(ele).find('.sell').css({'visibility':'unset'})
                     
                    }
                    
                    sellWait();
                 }else if(amtText <= 99 && amtText >= 66){
                     flowerStage = 'url("img/piranha3.png")';
                     
                 }else if (amtText >= 35 && amtText < 66){
                     flowerStage = 'url("img/piranha2.png")';
                 } else if(amtText > 0 && amtText < 35 ) {
                     flowerStage = 'url("img/piranha1.png")';
                 }
                $(ele).children('.piranha').css({'background':flowerStage})
            }





//vvvvvvvvvvvvvvvvvvvv Event Listeners vvvvvvvvvvvvvvvvvvvvvvvvv
    
            $('.buy').on('click dblclick', function (e){



                $('.buyplant').css({'visibility':'visible'})
                let theID = $(this).parents('.plot').attr('id');
                $(this).css({'visibility':'hidden'})
                tap.play();

                // if ($('.buyplant').css({'visibility':'visible'})){
                    
                // } )

                $('#daisy').on('click', function(e){ 
            
                    if (playerCoins >= 100){
                        let jQEle = $('#'+theID);
                        jQEle.attr('data-goal', 40) 
                        let goalAmount = (jQEle.attr('data-goal')*1);

                        let timer = setInterval(  function(){

                            let amount = (jQEle.attr('data-amt') * 1);
                            amount++;
                            jQEle.attr('data-amt', amount);

                            if(amount+1 > goalAmount){
                                clearInterval(timer);
                                jQEle.removeClass('planted')
                                jQEle.addClass('full-grown-daisy')
                            }
                            daisyGrowth(jQEle[0])
                            }, 500);

                        buyDaisy(jQEle[0]);
                        plant.play();
                        playerCoins=playerCoins-100;
                        $('#player-coins p').text(playerCoins)
                        $('#daisy').off('click');
                        $('#tulip').off('click');
                        $('#lilac').off('click');
                        $('#gardenia').off('click');
                        $('#piranha').off('click');

                        $('.buyplant').css({'visibility':'hidden'})
                    }else{
                        let jQEle = $('#'+theID)
                        jQEle.append('<p class="alert">You need more coins!</p>')
                        $('.alert').css({'top':(getRandInt(2,7)*20)+'px'})
                        $('.alert').animate({'top':'-=50px', 'opacity':'15%'}, 1500, function(){
                            jQEle.find('.alert').remove()
                        });
                        jQEle.find('.buy').css({'visibility':'unset'})
                        $('.buyplant').css({'visibility':'hidden'})
                        $('#daisy').off('click');
                        $('#tulip').off('click');
                        $('#lilac').off('click');
                        $('#gardenia').off('click');
                        $('#piranha').off('click');
                    }



                })//end of daisy click

                $('#tulip').on('click', function(e){ 
            
                    if (playerCoins >= 300){
                        let jQEle = $('#'+theID);
                        jQEle.attr('data-goal', 80) 
                        let goalAmount = (jQEle.attr('data-goal')*1);

                        let timer = setInterval(  function(){

                            let amount = (jQEle.attr('data-amt') * 1);
                            amount++;
                            jQEle.attr('data-amt', amount);

                            if(amount+1 > goalAmount){
                                clearInterval(timer);
                                jQEle.removeClass('planted')
                                jQEle.addClass('full-grown-tulip')
                            }
                            tulipGrowth(jQEle[0])
                            }, 500);

                        buyTulip(jQEle[0]);
                        plant.play();
                        playerCoins=playerCoins-300;
                        $('#player-coins p').text(playerCoins)
                        $('#daisy').off('click');
                        $('#tulip').off('click');
                        $('#lilac').off('click');
                        $('#gardenia').off('click');
                        $('#piranha').off('click');

                        $('.buyplant').css({'visibility':'hidden'})
                    } else {
                        let jQEle = $('#'+theID)
                        jQEle.append('<p class="alert">You need more coins!</p>')
                        $('.alert').css({'top':(getRandInt(2,7)*20)+'px'})
                        $('.alert').animate({'top':'-=50px', 'opacity':'15%'}, 1500, function(){
                            $(this).remove()
                        });
                        jQEle.find('.buy').css({'visibility':'unset'})
                        $('.buyplant').css({'visibility':'hidden'})
                        $('#daisy').off('click');
                        $('#tulip').off('click');
                        $('#lilac').off('click');
                        $('#gardenia').off('click');
                        $('#piranha').off('click');
                    }
                }) //end of tulip click


            $('#lilac').on('click', function(e){ 
            
            if (playerCoins >= 600){
                let jQEle = $('#'+theID);
                jQEle.attr('data-goal', 160) 
                let goalAmount = (jQEle.attr('data-goal')*1);
                let timer = setInterval(  function(){
                let amount = (jQEle.attr('data-amt') * 1);
                    amount++;
                    jQEle.attr('data-amt', amount);

                    if(amount+1 > goalAmount){
                        clearInterval(timer);
                        jQEle.removeClass('planted')
                        jQEle.addClass('full-grown-lilac')
                    }
                    lilacGrowth(jQEle[0])
                    }, 500);

                buyLilac(jQEle[0]);
                plant.play();
                playerCoins=playerCoins-600;
                $('#player-coins p').text(playerCoins)
                $('#daisy').off('click');
                $('#tulip').off('click');
                $('#lilac').off('click');
                $('#gardenia').off('click');
                $('#piranha').off('click');

                $('.buyplant').css({'visibility':'hidden'})
            } else {
                let jQEle = $('#'+theID)
                let rand = getRandInt(1,5)
                console.log(jQEle)
                jQEle.append('<p class="alert">You need more coins!</p>')
                $('.alert').css({'top':(getRandInt(2,7)*20)+'px'})
                $('.alert').animate({'top':'-=50px', 'opacity':'15%'}, 1500, function(){
                    $(this).remove()
                });
                jQEle.find('.buy').css({'visibility':'unset'})
                $('.buyplant').css({'visibility':'hidden'})
                $('#daisy').off('click');
                $('#tulip').off('click');
                $('#lilac').off('click');
                $('#gardenia').off('click');
                $('#piranha').off('click');
                
            }
        }) //end of lilac click

        $('#gardenia').on('click', function(e){ 
            
            if (playerCoins >= 1000){
                let jQEle = $('#'+theID);
                jQEle.attr('data-goal', 320) 
                let goalAmount = (jQEle.attr('data-goal')*1);
                let timer = setInterval(  function(){
                let amount = (jQEle.attr('data-amt') * 1);
                    amount++;
                    jQEle.attr('data-amt', amount);

                    if(amount+1 > goalAmount){
                        clearInterval(timer);
                        jQEle.removeClass('planted')
                        jQEle.addClass('full-grown-gardenia')
                    }
                    gardeniaGrowth(jQEle[0])
                    }, 500);

                buyGardenia(jQEle[0]);
                plant.play();
                playerCoins=playerCoins-1000;
                $('#player-coins p').text(playerCoins)
                $('#daisy').off('click');
                $('#tulip').off('click');
                $('#lilac').off('click');
                $('#gardenia').off('click');
                $('#piranha').off('click');

                $('.buyplant').css({'visibility':'hidden'})
            } else {
                let jQEle = $('#'+theID)
                let rand = getRandInt(1,5)
                console.log(jQEle)
                jQEle.append('<p class="alert">You need more coins!</p>')
                $('.alert').css({'top':(getRandInt(2,7)*20)+'px'})
                $('.alert').animate({'top':'-=50px', 'opacity':'15%'}, 1500, function(){
                    $(this).remove()
                });
                jQEle.find('.buy').css({'visibility':'unset'})
                $('.buyplant').css({'visibility':'hidden'})
                $('#daisy').off('click');
                $('#tulip').off('click');
                $('#lilac').off('click');
                $('#gardenia').off('click');
                $('#piranha').off('click');
                
            }
        }) //end of gardenia click

        $('#piranha').on('click', function(e){ 
            
            if (playerCoins >= 1500){
                let jQEle = $('#'+theID);
                jQEle.attr('data-goal', 640) 
                let goalAmount = (jQEle.attr('data-goal')*1);
                let timer = setInterval(  function(){
                let amount = (jQEle.attr('data-amt') * 1);
                    amount++;
                    jQEle.attr('data-amt', amount);

                    if(amount+1 > goalAmount){
                        clearInterval(timer);
                        jQEle.removeClass('planted')
                        jQEle.addClass('full-grown-piranha')
                        fullgrownflower.play()
                    }
                    piranhaGrowth(jQEle[0])
                    }, 500);

                buyPiranha(jQEle[0]);
                plant.play();
                playerCoins=playerCoins-1000;
                $('#player-coins p').text(playerCoins)
                $('#daisy').off('click');
                $('#tulip').off('click');
                $('#lilac').off('click');
                $('#gardenia').off('click');
                $('#piranha').off('click');

                $('.buyplant').css({'visibility':'hidden'})
            } else {
                let jQEle = $('#'+theID)
                let rand = getRandInt(1,5)
                
                jQEle.append('<p class="alert">You need more coins!</p>')
                $('.alert').css({'top':(getRandInt(2,7)*20)+'px'})
                $('.alert').animate({'top':'-=50px', 'opacity':'15%'}, 1500, function(){
                    $(this).remove()
                });
                jQEle.find('.buy').css({'visibility':'unset'})
                $('.buyplant').css({'visibility':'hidden'})
                $('#daisy').off('click');
                $('#tulip').off('click');
                $('#lilac').off('click');
                $('#gardenia').off('click');
                $('#piranha').off('click');
                
            }
        }) //end of gardenia click

                e.stopPropagation();
                
                
            })

// vvvvvvvvvvvvvvvvvvvv SELL FUNCTIONS vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

            $('.sell').on('click dblclick',  function (e){
                let theID = $(this).parents('.plot').attr('id'),
                    jQEle = '#'+theID;
                    tap.play();
                    e.stopPropagation()



                if ($(this).parents('.plot').hasClass('full-grown-daisy')){

                    $(this).parents('.plot').removeClass('full-grown-daisy');
                    $(jQEle).find('.daisy').remove();
                    $(this).css({'visibility':'hidden'});
                    $(this).siblings('.buy').css({'visibility':'unset'});
                    $(jQEle).attr('data-amt', 0);
                    $(this).siblings('div').find('span').css({'width': 0})

                    playerCoins=playerCoins+200;
                    $('#player-coins p').text(playerCoins)
         
                } else if ($(this).parents('.plot').hasClass('full-grown-tulip')){

                    $(this).parents('.plot').removeClass('full-grown-tulip');
                    $(jQEle).find('.tulip').remove();
                    $(this).css({'visibility':'hidden'});
                    $(this).siblings('.buy').css({'visibility':'unset'});
                    $(jQEle).attr('data-amt', 0);
                    $(this).siblings('div').find('span').css({'width': 0})
                    playerCoins=playerCoins+500;
                    $('#player-coins p').text(playerCoins)

                } else if ($(this).parents('.plot').hasClass('full-grown-lilac')){

                    $(this).parents('.plot').removeClass('full-grown-lilac');
                    $(jQEle).find('.lilac').remove();
                    $(this).css({'visibility':'hidden'});
                    $(this).siblings('.buy').css({'visibility':'unset'});
                    $(jQEle).attr('data-amt', 0);
                    $(this).siblings('div').find('span').css({'width': 0})
                    playerCoins=playerCoins+900;
                    $('#player-coins p').text(playerCoins)

                } else if ($(this).parents('.plot').hasClass('full-grown-gardenia')){

                    $(this).parents('.plot').removeClass('full-grown-gardenia');
                    $(jQEle).find('.gardenia').remove();
                    $(this).css({'visibility':'hidden'});
                    $(this).siblings('.buy').css({'visibility':'unset'});
                    $(jQEle).attr('data-amt', 0);
                    $(this).siblings('div').find('span').css({'width': 0})
                    playerCoins=playerCoins+1400;
                    $('#player-coins p').text(playerCoins)
                } else if ($(this).parents('.plot').hasClass('full-grown-piranha')){

                    $(this).parents('.plot').removeClass('full-grown-piranha');
                    $(jQEle).find('.piranha').remove();
                    $(this).css({'visibility':'hidden'});
                    $(this).siblings('.buy').css({'visibility':'unset'});
                    $(jQEle).attr('data-amt', 0);
                    $(this).siblings('div').find('span').css({'width': 0})
                    playerCoins=playerCoins+2000;
                    $('#player-coins p').text(playerCoins)
                }

            })





            $('.plot').on('click', function(ele){
                console.log(ele)
                if ($(ele.currentTarget).hasClass('planted')){
                
                let amount = $(this).attr('data-amt')
                let goalAmt = ($(this).attr('data-goal')*1)
                let amtText = Math.round(amount/goalAmt*100)
                amount = amount*1
                totalClicks ++;
                playerCoins ++;
                $('.total-clicks span').text(totalClicks);
                $('#player-coins p').text(playerCoins)
                $(this).attr('data-amt', amount)
                let currPlot = $(this)
                bonusAmount = 0
                if (currenttime >= 3600){ //after 1 hour
                    amount = amount+30;
                    currPlot.attr('data-amt', amount)
                    bonusAmount = 30
                }else if (currenttime >= 1200){ //after 20 minutes
                    amount = amount+10;
                    currPlot.attr('data-amt', amount)
                    bonusAmount = 10
                } else if (currenttime >= 600){ //after 10 minutes
                    amount = amount+5;
                    currPlot.attr('data-amt', amount)
                    bonusAmount = 5
                } 
                else if (currenttime >= 300){ //after 5 minutes
                    amount = amount+3;
                    currPlot.attr('data-amt', amount)
                    bonusAmount = 3
                } else {
                    amount = amount+1
                    currPlot.attr('data-amt', amount)
                    bonusAmount = 1
                }
                $('.click-multiplier span').text(bonusAmount)
            }
                
            })

                if (currenttime >= 3600){ //after 1 hour
                    bonusAmount = 30
                    $('.click-multiplier span').text(bonusAmount)
                } else if (currenttime >= 1200){ //after 20 minutes
                    bonusAmount = 10
                    $('.click-multiplier span').text(bonusAmount)
                } else if (currenttime >= 600){ //after 10 minutes
                    bonusAmount = 5
                    $('.click-multiplier span').text(bonusAmount)
                } 
                else if (currenttime >= 300){ //after 5 minutes
                    bonusAmount = 3
                    $('.click-multiplier span').text(bonusAmount)
                } else {
                    bonusAmount = 1
                    $('.click-multiplier span').text(bonusAmount)
                }
                //$('.click-multiplier span').text(bonusAmount)



            $('.plot').on('click', function(e){
                if ($(e.currentTarget).hasClass('planted')){
                let rand = getRandInt(1,3)
                click.play();
                $('<p>').text('•').addClass('click').appendTo('body').css({'position':'absolute', 'left':e.pageX+(rand*2)+'px', 'top':e.pageY+rand+'px'}).animate({'top':'-=150px', 'opacity':'15%', 'font-size': rand+'rem'}, 1500, function(){
                $(this).remove()
                });
                e.stopPropagation()
            }
            })
            

            function getRandInt(min=1,max=100) {
                return Math.floor(Math.random()*(max-min+1)) + min;
            }
           

            function upDown(piranha){
                //this is the enemy bird that gets passed from createEnemy()
                if(piranha.frameNum == undefined){
                    //the bird does not have this property
                    piranha.frameNum = 0;
                }else{
                    piranha.frameNum++;
                }

                let frames = [0,1,2,3];
                let frameWidth = 160;

                if(piranha.frameNum > 3){
                        piranha.frameNum = 0;
                }

                let bgPos = frameWidth * frames[piranha.frameNum];
                $(piranha).css({'background-position': bgPos+'px 0px'});

                setTimeout( function(){
                    upDown(piranha);
                }, 250)
                


            }

        })();
