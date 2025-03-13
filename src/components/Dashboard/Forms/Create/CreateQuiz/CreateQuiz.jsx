import '../../Form.css';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MathRender from '../../../../MathRender/MathRender';
import DOMPurify from 'dompurify';

export default function CreateQuiz() {
    const navigate = useNavigate();
    const quizTitle = useRef();
    const quizDescription = useRef();
    const quizDifficulty = useRef();
    const questionRefs = useRef([]);
    const answerRefs = useRef([]);
    const imagesRefs = useRef([]);

    const [errors, setErrors] = useState({});
    const [selectedAnswers, setSelectedAnswers] = useState({0:0});
    const [questions, setQuestions] = useState([0]);
    const [questionImages, setQuestionImages] = useState({});
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false)

    function handleNewQuestion(){
        if(questions.length < 40){
            setErrors(prev => ({ 
                ...prev,
                questions_limit: undefined 
            }));
            setQuestions(prevQuestions => {
                const newQuestionIndex = prevQuestions.length;
                setSelectedAnswers(prevAnswers => ({
                    ...prevAnswers,
                    [newQuestionIndex]: 0
                }));
                return [...prevQuestions, newQuestionIndex];
            });
        }else{
            setErrors(prev => ({
                ...prev,
                questions_limit: 'You can only add up to 40 questions per quiz'
            }));
        }
    }

    function handleDeleteQuestion(questionIndex){
        if(questions.length > 1){
            setSelectedAnswers(prev => delete prev[questionIndex]);

            setQuestions(prev => [
                ...prev.slice(0, questionIndex),
                ...prev.slice(questionIndex + 1)
            ]);

        }else{
            setErrors(prev => ({
                ...prev,
                questions_limit: 'You cant create a quiz without quesions'
            }));
        }
    }

    function handleCheckboxChange(questionIndex, answerIndex){
        setErrors(prev => ({
            ...prev,
            [`questions.${questionIndex}.answers.${answerIndex}.correct_answer`]: undefined
        }))
        setSelectedAnswers(prev => ({
        ...prev,
        [questionIndex]: answerIndex
        }));
    }

    function handleImageUpload(questionIndex, file) {
        setErrors(prev => ({ ...prev, 
            [`questions.${questionIndex}.question_image`]: undefined 
        }));

        const validImageTypes = ["image/png", "image/jpeg", "image/jpg"];
        const maxImageSize = 4;

        let error;

        if (!validImageTypes.includes(file.type)) {
            error = "Allowed formats: PNG, JPG, JPEG";
        }

        if (file.size > maxImageSize * 1024 * 1024) {
            error = `Image must be less than ${maxImageSize}MB`;
        }

        if (/\..+\./.test(file.name)) {
            error = "Invalid file name format";
        }

        if (error) {
            return setErrors(prev => ({ ...prev, 
                [`questions.${questionIndex}.question_image`]: error 
            }));
        }

        setQuestionImages(prev => ({
            ...prev,
            [questionIndex]: file
        }));

        const newImage = URL.createObjectURL(file);
        imagesRefs.current[questionIndex].src = newImage;
    }

    function handleDragOver(e){
        e.preventDefault();
        setIsDragging(true);
    }

    function handleDragLeave(e){
        e.preventDefault();
        setIsDragging(false);
    }

    function handleDrop(e,questionIndex){
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];

        if (!droppedFile) {
            return;
        }

        handleImageUpload(questionIndex,droppedFile);
    }

    function handleQuizCreation(event) {
        event.preventDefault();
        setIsSubmitting(true)
        const formData = new FormData();

        formData.append('quiz_title', quizTitle.current.value);
        formData.append('quiz_description', quizDescription.current.value);
        formData.append('quiz_difficulty', quizDifficulty.current.value);

        questions.forEach((questionIndex) => {
            const questionDescription = questionRefs.current[questionIndex]?.value || '';
            formData.append(`questions[${questionIndex}][question_description]`, questionDescription);

            if (questionImages[questionIndex]) {
                formData.append(
                    `questions[${questionIndex}][question_image]`,
                    questionImages[questionIndex],
                    `question_${questionIndex}_image`
                );
            }

            [0, 1, 2, 3].forEach((answerIndex) => {
                const answerText = answerRefs.current[questionIndex]?.[answerIndex]?.value || '';
                const isCorrect = selectedAnswers[questionIndex] === answerIndex ? '1' : '0';

                formData.append(`questions[${questionIndex}][answers][${answerIndex}][question_answer_text]`, answerText);
                formData.append(`questions[${questionIndex}][answers][${answerIndex}][correct_answer]`, isCorrect);
            });
        });

        axios.post('/quizzes', formData, {
            headers: { 
            'Content-Type': 'multipart/form-data'
            }
        }).then(() =>{
            navigate('/dashboard/quizzes');
        }).catch(error => {
            if (error.response?.data?.errors) {
                const formattedErrors = {};
                Object.entries(error.response.data.errors).forEach(([key, value]) => {
                    formattedErrors[key] = value[0]; 
                });
                setErrors(formattedErrors);
            }
        }).finally(()=>{
            setIsSubmitting(false)
        })
    }

    return (
        <div className='form'>
            <div className='container'>
                <div className='header'>
                    <h1>Create Quiz</h1>
                </div>

                <form>
                    <div>
                        <label>Quiz title</label>
                        <input
                            ref={quizTitle} 
                            type="text" 
                            placeholder='Quiz Title' 
                            required
                            pattern="/^[\p{L}\p{N}\p{S}\p{P}\s]{3,50}$/u" 
                            minLength={3}
                            maxLength={50} 
                            onChange={() => setErrors(prev => ({...prev, quiz_title: undefined }))}
                        />
                        {errors['quiz_title'] && <p className='error'>{errors['quiz_title']}</p>}
                    </div>

                    <div>
                        <label>Quiz description</label>
                        <textarea 
                            ref={quizDescription} 
                            placeholder='Quiz Description' 
                            required
                            pattern="/^[\p{L}\p{N}\p{S}\p{P}\s]{3,150}$/u" 
                            minLength={3}
                            maxLength={150} 
                            onChange={() => setErrors(prev => ({
                                ...prev,
                                [`quiz_description`]: undefined
                            }))}
                        />
                        {errors['quiz_description'] && <p className='error'>{errors['quiz_description']}</p>}
                    </div>

                    <div>
                        <label>Quiz difficulty</label>
                        <select ref={quizDifficulty}>
                            <option value="1">Easy</option>
                            <option value="2">Medium</option>
                            <option value="3">Hard</option>
                        </select>
                        {errors['quiz_difficulty'] && <p className='error'>{errors['quiz_difficulty']}</p>}
                    </div>

                    {questions.map((questionIndex) => (
                        <div key={questionIndex} className="question-card">
                            <div className='question-header'>
                                <h3>Question {questionIndex + 1}</h3>
                                <h3 className='delete' onClick={() => {handleDeleteQuestion(questionIndex)}}>X</h3>
                            </div>

                            <div>
                                <label>Question Description</label>
                                <textarea 
                                    placeholder='Question Description (use $...$ for math equations)' 
                                    required
                                    pattern="^[\p{L}\p{N}\p{S}\p{P}\s\^\_\$\\\/\(\)\{\}\+=]{3,100}$"
                                    minLength={3}
                                    maxLength={100}
                                    ref={(element) => (questionRefs.current[questionIndex] = element)} 
                                    onChange={(e) => {
                                        const sanitized = DOMPurify.sanitize(e.target.value)
                                            .replace(/</g, '&lt;')
                                            .replace(/>/g, '&gt;');
                                        e.target.value = sanitized;
                                        setErrors(prev => ({
                                            ...prev,
                                            [`questions.${questionIndex}.question_description`]: undefined
                                        }));
                                    }}                          
                                />
                                {errors[`questions.${questionIndex}.question_description`] && (
                                    <p className='error'>
                                        {errors[`questions.${questionIndex}.question_description`]}
                                    </p>
                                )}
                                <div className="math-preview">
                                    <MathRender content={questionRefs.current[questionIndex]?.value || ''} />
                                </div>
                            </div>

                            <div>
                                <label>Question Image (Optional)</label>
                                <label id='file-upload'
                                    className={`upload-box ${questionImages[questionIndex] ? 'success' : ''} ${errors[`questions.${questionIndex}.question_image`] ? 'error' : ''} ${isDragging ? 'active' : ''}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e,questionIndex)}
                                >
                                    <img src="/upload-image.svg" alt=""
                                        ref={(element) => (
                                            imagesRefs.current[questionIndex] = element
                                        )}
                                    />
                                    <input type="file" accept="image/*" className='image-upload' hidden
                                        onChange={(element) =>{ 
                                            handleImageUpload(questionIndex, element.target.files[0],questionIndex);
                                        }}
                                    />
                                    <p>Drag & drop or Browse File to Upload</p>
                                </label>
                                {errors[`questions.${questionIndex}.question_image`] && (
                                    <p className='error'>
                                        {errors[`questions.${questionIndex}.question_image`]}
                                    </p>
                                )}
                            </div>

                            <div className="answers-section">
                                <h4>Answers</h4>
                                {[0,1,2,3].map((answerIndex) =>(
                                    <div key={answerIndex} className="answer-input">
                                        <label>Answer text</label>
                                        <input 
                                            type="text" 
                                            placeholder="Answer text (use ^ for exponents, _ for subscripts)" 
                                            minLength={1}
                                            maxLength={50} 
                                            required
                                            onChange={(e) => {
                                                const sanitized = DOMPurify.sanitize(e.target.value)
                                                    .replace(/</g, '&lt;')
                                                    .replace(/>/g, '&gt;');
                                                e.target.value = sanitized;

                                                setQuestions(prev => [...prev]);
                                            }}
                                            ref={(element) => (
                                                answerRefs.current[questionIndex] = answerRefs.current[questionIndex] || [],
                                                answerRefs.current[questionIndex][answerIndex] = element
                                            )}
                                        />
                                        {errors[`questions.${questionIndex}.answers.${answerIndex}.question_answer_text`] && (
                                            <p className='error'>
                                                {errors[`questions.${questionIndex}.answers.${answerIndex}.question_answer_text`]}
                                            </p>
                                        )}
                                        <label>
                                            Correct:
                                            <input type="checkbox"
                                                checked={selectedAnswers[questionIndex] === answerIndex}
                                                onChange={() => handleCheckboxChange(questionIndex, answerIndex)}
                                            />
                                            {errors[`questions.${questionIndex}.answers.${answerIndex}.correct_answer`] && (
                                                <p className='error'>
                                                    {errors[`questions.${questionIndex}.answers.${answerIndex}.correct_answer`]}
                                                </p>
                                            )}
                                        </label>
                                        <div className="math-preview">
                                            <MathRender 
                                                content={answerRefs.current[questionIndex]?.[answerIndex]?.value || ''}
                                                key={answerRefs.current[questionIndex]?.[answerIndex]?.value}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {errors['questions_limit'] && <p className='error'>{errors['questions_limit']}</p>}

                    <button type="button" onClick={handleNewQuestion}>
                    Add Question ({questions.length}/{50})
                    </button>
                    <button disabled={isSubmitting} type="submit" onClick={(event) => {handleQuizCreation(event)}}>
                        {
                            isSubmitting ?
                            "Loading..." :
                            "Create Quiz" 
                        }
                    </button>
                </form>
            </div>
        </div>
    );
}