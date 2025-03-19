SELECT * FROM public.roles
ORDER BY role_id ASC 

insert into public.roles (name,description) values('cashier','this is cashier role')

-- role id: 1



SELECT * FROM public.permissions
ORDER BY permission_id ASC 

insert into public.permissions (name,description) values('product-delete','can delete product')

-- permission id (1,2,3)



SELECT * FROM public.role_permissions
ORDER BY role_permission_id ASC 

insert into public.role_permissions (role_id,permission_id) values (2,4)


SELECT * FROM public.user_roles
ORDER BY user_role_id ASC 

insert into public.user_roles (user_id,role_id) values (3,1)