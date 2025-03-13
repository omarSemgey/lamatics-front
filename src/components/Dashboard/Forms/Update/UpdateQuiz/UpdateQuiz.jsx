import '../../Form.css';
import Loading from '../../../../Loading/Loading';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import MathRender from '../../../../MathRender/MathRender';
import DOMPurify from 'dompurify';

export default function UpdateQuiz() {
    const id = useParams();
    const navigate = useNavigate();

    const quizTitle = useRef();
    const quizDescription = useRef();
    const quizDifficulty = useRef();
    const questionRefs = useRef([]);
    const answerRefs = useRef([]);
    const imagesRefs = useRef([]);

    const [isLoading, setIsLoading] = useState(true);
    const [quiz,setQuiz] = useState({});
    const [errors, setErrors] = useState({});
    const [selectedAnswers, setSelectedAnswers] = useState({0:0});
    const [questions, setQuestions] = useState([]);
    const [previewUrls, setPreviewUrls] = useState({});
    const [questionImages, setQuestionImages] = useState({});
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const fetchQuizData = async () => {
            await axios.get(`/quizzes/${id.quiz}`)  
            .then((response) => {
                setQuiz(response.data.quiz);

                setQuestions(response.data.quiz.quiz_questions || [])

                const initialSelectedAnswers = {};

                response.data.quiz.quiz_questions?.forEach((question, questionIndex) => {
                    question.question_answers?.forEach((answer, answerIndex) => {
                        if(answer.correct_answer === 1) {
                            initialSelectedAnswers[questionIndex] = answerIndex;
                        }
                    });

                    setPreviewUrls(prev => ({
                        ...prev,
                        [question.quiz_question_id]: question.question_image
                    }));
                });

                setSelectedAnswers(initialSelectedAnswers);

                setIsLoading(false);
            });
        };

        fetchQuizData();
    }, [id]);

    function handleNewQuestion(){
        if(questions.length < 50){
            setErrors(prev => ({ 
                ...prev,
                questions_limit: undefined 
            }));

            setQuestions(prevQuestions => {
                const tempId = Date.now();
                const newQuestion = {
                    temp_id: tempId,
                    question_answers: Array(4).fill().map(() => ({
                        question_answer_text: "",
                        correct_answer: 0
                    }))
                };

                setSelectedAnswers(prevAnswers => ({
                    ...prevAnswers,
                    [prevQuestions.length]: 0 
                }));

                return [...prevQuestions, newQuestion];
            });
        }else{
            setErrors(prev => ({
                ...prev,
                questions_limit: 'You can only add up to 50 questions per quiz'
            }));
        }
    }

    function handleDeleteQuestion(questionIndex) {
        if (questions.length > 1) {
            const questionId = questions[questionIndex].quiz_question_id || questions[questionIndex].temp_id;

            setQuestions(prev => prev.filter((_, idx) => idx !== questionIndex));

            setPreviewUrls(prev => {
                const { [questionId]: removed, ...rest } = prev;
                return rest;
            });

            setQuestionImages(prev => {
                const { [questionId]: removed, ...rest } = prev;
                return rest;
            });

            setSelectedAnswers(prev => {
                const newState = {};
                Object.entries(prev).forEach(([key, value]) => {
                    const numKey = Number(key);
                    if (numKey < questionIndex) newState[numKey] = value;
                    if (numKey > questionIndex) newState[numKey - 1] = value;
                });
                return newState;
            });
        } else {
            setErrors({ questions_limit: "You can't create a quiz without questions" });
        }
    }

    function handleCheckboxChange(questionIndex, answerIndex){
        setErrors(prev => ({
            ...prev,
            [`questions.${questionIndex}.answers.${answerIndex}.correct_answer`]: undefined
        }));

        setSelectedAnswers(prev => ({
        ...prev,
        [questionIndex]: answerIndex
        }));
    }

    function handleImageUpload(questionId, file) {
        setErrors(prev => ({ ...prev, 
            [`questions.${questionId}.question_image`]: undefined 
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
                [`questions.${questionId}.question_image`]: error 
            }));
        }

        const newImageUrl = URL.createObjectURL(file);
        setPreviewUrls(prev => ({
            ...prev,
            [questionId]: newImageUrl
        }));
        setQuestionImages(prev => ({
            ...prev,
            [questionId]: file
        }));
    }

    function handleDragOver(e){
        e.preventDefault();
        setIsDragging(true);
    }

    function handleDragLeave(e){
        e.preventDefault();
        setIsDragging(false);
    }

    function handleDrop(e,questionId){
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];

        if (!droppedFile) {
            return;
        }

        handleImageUpload(questionId,droppedFile);
    }

    async function updateQuizInfo(event) {
        event.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData();

        if(quizTitle.current.value) formData.append('quiz_title', quizTitle.current.value);
        if(quizDescription.current.value) formData.append('quiz_description', quizDescription.current.value);
        if(quizDifficulty.current.value) formData.append('quiz_difficulty', quizDifficulty.current.value);

        formData.append("_method", "PUT");

        questions.forEach((question, index) => {
            const questionId = question.quiz_question_id || question.temp_id;
            formData.append(`questions[${index}][quiz_question_id]`, question.quiz_question_id || '');
            formData.append(`questions[${index}][question_description]`, questionRefs.current[index]?.value || '');

            if (questionImages[questionId]) {
                formData.append(
                    `questions[${index}][question_image]`,
                    questionImages[questionId],
                    `question_${index}_image`
                );
            }

            question.question_answers.forEach((answer, answerIndex) => {
                const answerText = answerRefs.current[index]?.[answerIndex]?.value || '';
                const isCorrect = selectedAnswers[index] === answerIndex ? '1' : '0';

                formData.append(`questions[${index}][answers][${answerIndex}][question_answer_id]`, 
                    answer.question_answer_id || ''
                );
                formData.append(`questions[${index}][answers][${answerIndex}][question_answer_text]`, answerText);
                formData.append(`questions[${index}][answers][${answerIndex}][correct_answer]`, isCorrect);
            });
        });

        axios.post(`/quizzes/${id.quiz}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then(() => {
            navigate('/dashboard/quizzes');
        }).catch(error => {
            if (error.response?.data?.errors) {
                const formattedErrors = {};
                Object.entries(error.response.data.errors).forEach(([key, value]) => {
                    formattedErrors[key] = value[0]; 
                });
                setErrors(formattedErrors);
            }
        }).finally(() => {
            setIsSubmitting(false);
        });
    }

    if (isLoading) {
        return <Loading></Loading>;
    }

    return (
        <>
            <div className='form'>
                <div className='container'>
                    <div className='header'>
                        <h1>Update Quiz</h1>
                    </div>

                    <form>

                        <div>
                            <label>Quiz title</label>
                            <input ref={quizTitle} 
                                type="text" 
                                placeholder='Title' 
                                pattern="/^[\p{L}\p{N}\p{S}\p{P}\s]{3,50}$/u" 
                                minLength={3}
                                maxLength={50} 
                                defaultValue={quiz.quiz_title} 
                            />
                            {errors['quiz_title'] && <p className='error'>{errors['quiz_title']}</p>}
                        </div>

                        <div>
                            <label>Quiz description</label>
                            <textarea 
                                ref={quizDescription} 
                                placeholder='Description' 
                                defaultValue={quiz.quiz_description} 
                                pattern="/^[\p{L}\p{N}\p{S}\p{P}\s]{3,150}$/u" 
                                maxLength={100}
                            />
                            {errors['quiz_description'] && <p className='error'>{errors['quiz_description']}</p>}
                        </div>

                        <div>
                            <label>Quiz difficulty</label>
                            <select ref={quizDifficulty} defaultValue={quiz.quiz_difficulty}>
                                <option value="1">Easy</option>
                                <option value="2">Medium</option>
                                <option value="3">Hard</option>
                            </select>
                            {errors['quiz_difficulty'] && <p className='error'>{errors['quiz_difficulty']}</p>}
                        </div>

                        {questions?.map((question, questionIndex) => {
                        const questionId = question.quiz_question_id || question.temp_id;
                        return(
                        <div key={questionId} className="question-card">
                            <div className='question-header'>
                                <h3>Question {questionIndex + 1}</h3>
                                <h3 className='delete' onClick={() => {handleDeleteQuestion(questionIndex)}}>X</h3>
                            </div>

                            <div>
                                <label>Question Description</label>
                                <textarea 
                                    placeholder='Question Description (use $...$ for math equations)' 
                                    defaultValue={question.question_description} 
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
                                    className={`upload-box ${previewUrls[questionId]? 'success' : ''} ${errors[`questions.${questionIndex}.question_image`] ? 'error' : ''} ${isDragging ? 'active' : ''}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e,questionId)}
                                >
                                    <img     
                                        src={previewUrls[questionId] || '/upload-image.svg'} 
                                        alt=""
                                        ref={(element) => (imagesRefs.current[questionId] = element)}
                                    />
                                    <input type="file" accept="image/*" className='image-upload' hidden
                                        onChange={(e) => handleImageUpload(questionId, e.target.files[0])}
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
                                {question.question_answers?.map((answer, answerIndex) =>(
                                    <div key={answer.question_answer_id || answerIndex} className="answer-input">
                                        <label>Answer text</label>
                                        <input 
                                            type="text" 
                                            placeholder="Answer text (use ^ for exponents, _ for subscripts)" 
                                            required 
                                            minLength={3}
                                            maxLength={50} 
                                            defaultValue={answer.question_answer_text}
                                            onChange={(e) => {
                                                const sanitized = DOMPurify.sanitize(e.target.value)
                                                    .replace(/</g, '&lt;')
                                                    .replace(/>/g, '&gt;');
                                                e.target.value = sanitized;

                                                setQuestions(prev => [...prev]);
                                            }}
                                            ref={(element) => {
                                                if (!answerRefs.current[questionIndex]) {
                                                    answerRefs.current[questionIndex] = [];
                                                }
                                                answerRefs.current[questionIndex][answerIndex] = element;
                                            }}
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
                        )})}

                        {errors['questions_limit'] && <p className='error'>{errors['questions_limit']}</p>}

                        <button type="button" onClick={handleNewQuestion}>Add Question({questions.length} / {50})</button>
                        <button disabled={isSubmitting} onClick={(event) => updateQuizInfo(event)}>
                            {
                                isSubmitting ?
                                "Loading..." :
                                "Update quiz"
                            }
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}