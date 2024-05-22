import mongoose from 'mongoose';

const gradesSchema = new mongoose.Schema({
    scores: [{
        type: {
            type: String,
            enum: ['exam', 'quiz', 'homework'],
            required: true
        },
        score: {
            type: Number,
            required: true
        }
    }],
    class_id: {
        type: Number,
        // required: true
    },
    learner_id: {
        type: Number,
        // required: true
    }
})



export default new mongoose.model('Grades', gradesSchema);
