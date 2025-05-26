// features/menu/menu-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: 'menu',
    component: MenuPage,
    children: [
      { path: 'panic', loadChildren: () => import('../panic/panic.module').then(m => m.PanicPageModule) },
      {
        path: 'camera',
        loadChildren: () => import('../camera/camera.module').then(m => m.CameraPageModule)
      },
      {
        path: 'contacts',
        children: [
          {
            path: '',
            loadChildren: () => import('../contacts/contacts.module')
              .then(m => m.ContactsPageModule)
          },
          {
            path: 'add-contact',
            loadChildren: () => import('../contacts/add-contact/add-contact.module')
              .then(m => m.AddContactPageModule)
          }
        ]
      },
      { path: '', redirectTo: 'panic', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/menu/panic', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class MenuPageRoutingModule { }
