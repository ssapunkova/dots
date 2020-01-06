import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { WorkoutsPage } from './workouts/workouts.page'
import { WorkoutSheetPage } from './workoutSheet/workoutSheet.page'
import { WorkoutManagerPage } from './workoutManager/workoutManager.page'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'workouts',
    loadChildren: () => import('./workouts/workouts.module').then(m => m.WorkoutsPageModule)
  },
  {
    path: 'workoutSheet/:sheetId',
    loadChildren: () => import('./workoutSheet/workoutSheet.module').then(m => m.WorkoutSheetPageModule)
  },
  {
    path: 'workoutManager/:sheetId',
    loadChildren: () => import('./workoutManager/workoutManager.module').then(m => m.WorkoutManagerPageModule)
  },
  {
    path: 'nutrition',
    loadChildren: () => import('./nutrition/nutrition.module').then(m => m.NutritionPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
