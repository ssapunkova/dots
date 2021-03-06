import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { UserService } from './services/user.service';

import { WorkoutsPage } from './workouts/workouts.page';
import { WorkoutSheetPage } from './workoutSheet/workoutSheet.page';
import { WorkoutManagerPage } from './workoutManager/workoutManager.page';
import { CalculatorsPage } from './calculators/calculators.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
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
    path: 'vitals',
    loadChildren: () => import('./vitals/vitals.module').then(m => m.VitalsPageModule),
    resolve: { userData: UserService }
  },
  {
    path: 'calculators',
    loadChildren: () => import('./calculators/calculators.module').then(m => m.CalculatorsPageModule),
    resolve: { userData: UserService }
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
    path: 'guide', 
    loadChildren: './guide/guide.module#GuidePageModule',
    resolve: { userData: UserService }
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