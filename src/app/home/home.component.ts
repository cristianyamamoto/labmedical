import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    CommonModule,
    DropdownModule,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  loggedUser: {name: string, auth: boolean} | undefined = undefined;
  visible: boolean = false;
  exerciseForm = new FormGroup(
    {
      id: new FormControl(''),
      type: new FormControl('', Validators.required),
      description: new FormControl(''),
      date: new FormControl('', Validators.required),
      distance: new FormControl(''),
      time: new FormControl(''),
    }
  )
  types: any[] = [
    {"name": "Lunges", "image": "assets/exercises/lunges.jpg"},
    {"name": "Pushups", "image": "assets/exercises/pushups.jpg"},
    {"name": "Squats", "image": "assets/exercises/squats.jpg"},
    {"name": "Planks", "image": "assets/exercises/planks.jpg"},
    {"name": "Jumping Jacks", "image": "assets/exercises/jumping-jacks.jpg"},
    {"name": "Burpees", "image": "assets/exercises/burpees.jpg"},
    {"name": "Mountain Climbers", "image": "assets/exercises/mountain-climbers.jpg"},
    {"name": "High Knees", "image": "assets/exercises/high-knees.jpg"},
    {"name": "Bicycle Crunches", "image": "assets/exercises/bicycle-crunches.jpg"},
    {"name": "Jump Rope", "image": "assets/exercises/jump-rope.jpg"}
  ];
  exercises: any[] = this.getExercises();
  filteredExercises : any = this.exercises;
  exercise : any = undefined;
  editExercise: boolean = false;

  constructor(private router: Router) { };

  ngOnInit(): void {
    this.exercises = this.getExercises();
    this.filteredExercises = this.exercises;
  };

  showDialog(){
    this.exerciseForm.reset({type: ''});
    this.visible = true;
    this.editExercise = false;
  }

  showDialogEditExercise(exercise: any){
    if(exercise){
      this.visible = true;
      this.editExercise = true;
      this.exerciseForm.setValue(exercise);
    }
  }

  getExercises() {
    const exercises = localStorage.getItem("exercises");
    if (!!exercises) {
      return JSON.parse(exercises);
    } else {
      localStorage.setItem("exercises", JSON.stringify([]));
      return [];
    };
  }

  createExercise() {
    const optionalInputs = [
      { "Description": this.exerciseForm.value.description },
      { "Distance": Number(this.exerciseForm.value.distance) },
      { "Time" : this.exerciseForm.value.time }
    ]
    const requiredInputs = [
      { "Type": this.exerciseForm.value.type },
      { "Date": this.exerciseForm.value.date },
    ]

    const checkFormInputs = requiredInputs.find((input) => {
      if(!Object.values(input)[0]) {
        alert(`Fill ${Object.keys(input)} field!`);
        return true;
      }
      return false;
    });

    if (!checkFormInputs){
      const id = (this.exercises[this.exercises.length - 1]?.id ?? -1) + 1;
      const newExercise = {
        id,
        type: requiredInputs[0]["Type"],
        description: optionalInputs[0]["Description"],
        date: requiredInputs[1]["Date"],
        distance: optionalInputs[1]["Distance"],
        time: optionalInputs[2]["Time"],
      };
      this.exercises.push(newExercise);
      localStorage.setItem("exercises", JSON.stringify(this.exercises));
      this.exerciseForm.reset();
      this.visible = false;
    }
  }

  deleteExercise() {
    this.visible = false;
    this.exercises = this.exercises.filter((e)=> e.id !== this.exerciseForm.value.id);
    this.filteredExercises = this.exercises;
    localStorage.setItem("exercises", JSON.stringify(this.exercises))
  }

  updateExercise() {
    this.visible = false;
    this.exercises.find((e)=> {
      if (e.id === this.exerciseForm.value.id) {
        Object.assign(e,
          {
            type: this.exerciseForm.value.type,
            description: this.exerciseForm.value.description,
            date: this.exerciseForm.value.date,
            distance: this.exerciseForm.value.distance,
            time: this.exerciseForm.value.time
          }
        );
        return true;
      }
      return false;
    });
    localStorage.setItem("exercises", JSON.stringify(this.exercises));
  }

  searchExercise() {
    if(!this.exercise) {
      this.filteredExercises = this.exercises;
    } else {
      this.filteredExercises = this.exercises.filter((exercise: { type: any; }) => exercise.type.name.toLowerCase().includes(this.exercise.toLowerCase()));
    }
  }

  cancel() {
    this.visible = false;
    this.editExercise = false;
  }

}
