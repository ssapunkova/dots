import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { UserService } from './services/user.service';

import { WorkoutsPage } from './workouts/workouts.page';
import { WorkoutSheetPage } from './workoutSheet/workoutSheet.page';
import { WorkoutManagerPage } from './workoutManager/workoutManager.page';
import { ParamsPage } from './params/params.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
    resolve: { userData: UserService }
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    resolve: { userData: UserService }
  },
  {
    path: 'workouts',
    loadChildren: () => import('./workouts/workouts.module').then(m => m.WorkoutsPageModule),
    resolve: { userData: UserService }
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
    loadChildren: () => import('./nutrition/nutrition.module').then(m => m.NutritionPageModule),
    resolve: { userData: UserService }
  },
  {
    path: 'params',
    loadChildren: () => import('./params/params.module').then(m => m.ParamsPageModule)
  },
  {
    path: 'params/:topic',
    loadChildren: () => import('./params/params.module').then(m => m.ParamsPageModule)
  },
  { 
    path: 'register', 
    loadChildren: './register/register.module#RegisterPageModule' 
  },
  { 
    path: 'register/:tokenId', 
    loadChildren: './register/register.module#RegisterPageModule' 
  },
  { 
    path: 'login', 
    loadChildren: './login/login.module#LoginPageModule' 
  },
  { 
    path: 'welcome', 
    loadChildren: './welcome/welcome.module#WelcomePageModule' 
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [UserService]
})
export class AppRoutingModule {}

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule],
//   providers: [
//     UserService
//   ]
// })
// export class AppRoutingModule {}