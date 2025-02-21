const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')
const grade = document.getElementById('grade')
const catbtnsHtml=document.querySelectorAll('.catbtn')
const restartBtn=document.getElementById('restart')
const categoryDiv=document.getElementById('category')
const controls = document.getElementById('controls')
const API='YOUR API'

let shuffledQuestions, currentQuestionIndex
let score=0;

const catBtns=Array.from(catbtnsHtml)
catBtns.forEach(catBtn=>{
catBtn.addEventListener('click',getCat)
}
)

restartBtn.addEventListener('click', ()=>{
    categoryDiv.classList.remove('hide')
    controls.classList.add('hide')
    questionContainerElement.classList.add('hide')
    grade.classList.add('hide')
    restartBtn.classList.add('hide')
    score=0
    currentQuestionIndex=0
})

async function getCat(e){
    
    const cat = e.target.value
    console.log(cat)
    const catQuestions =
     await fetch(`https://quizapi.io/api/v1/questions?apiKey=${API}&limit=10&category=${cat}`)
     .then(res=>res.json())
     console.log(catQuestions)
     questions=catQuestions
     categoryDiv.classList.add('hide')
     controls.classList.remove('hide')
     startGame()
}

startButton.addEventListener('click', startGame)
nextButton.addEventListener('click',()=>{
    currentQuestionIndex++
    setNextQuestion()
})
function startGame(){
    console.log('started')
    startButton.classList.add('hide')
    shuffledQuestions = questions.sort(()=>Math.random()-0.5)
    currentQuestionIndex=0
    questionContainerElement.classList.remove('hide')
    setNextQuestion()
}

function setNextQuestion(){
    resetState()
    showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(question){
const correctAns=findCorrect(question.correct_answers)
const answers = question.answers
questionElement.innerHTML=question.question
let ind=0
for(let i in answers){
    if(answers[i]){
    const button=document.createElement('button')
    button.classList.add('btn')
    if(ind==correctAns){
        button.dataset.correct=true
    }
     button.innerText=answers[i]
     button.addEventListener('click', selectAnswer)
     answerButtonsElement.appendChild(button)
    ind++
}
}
}

function findCorrect(answers){
    let index=0
for(let k in answers){
    if(answers[k]=='true'){
        console.log(k)
        return index
    }
    index++
}
}

function resetState(){
    grade.innerHTML=''
    grade.classList.add('hide')
    nextButton.classList.add('hide')
    clearStatusClass(document.body)
    while(answerButtonsElement.firstChild){
        answerButtonsElement.removeChild(answerButtonsElement.firstChild)
    }
}

function selectAnswer(e){
    const selectedButton = e.target
    if(selectedButton.dataset.correct){
        score++
    }else{
        score--
    }
    const correct = selectedButton.dataset.correct
    setStatusClass(document.body, correct)
    Array.from(answerButtonsElement.children).forEach(button=>{
        setStatusClass(button, button.dataset.correct)
    })
    if(shuffledQuestions.length>currentQuestionIndex+1){
    nextButton.classList.remove('hide')
    }else{
        
        grade.classList.remove('hide')
        grade.innerText='Your score: '+score
        restartBtn.classList.remove('hide')

    }
}

function setStatusClass(element, correct){
    clearStatusClass(element)
    if(correct){
        element.classList.add('correct')
    }else{
        element.classList.add('wrong')
    }
}

function clearStatusClass(element){
    element.classList.remove('correct')
    element.classList.remove('wrong')
}

let questions

