const MenuItem= require('../model/MenuItems');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUploader');


const createMenuItem= async(req,res)=>{
    try{
        const menuItem=new MenuItem(req.body);
        const image=req.file;
        if(image){
            const uploadResult=await uploadToCloudinary(image.buffer,'menu_items');
            menuItem.imageUrl=uploadResult.secure_url;
            menuItem.imagePublicId=uploadResult.public_id;
        }
        await menuItem.save();
        res.status(201).json(menuItem);
    }catch{
        res.status(400).json('Error creating menu item');
    }
}

const deleteMenuItem=async(req,res)=>{
    try{
        const id=req.params.id;
        const menuItem=await MenuItem.findById(id)
        if(!menuItem){
            return res.status(400).json('Menu Item not found')
        }
        deleteFromCloudinary(menuItem.imagePublicId)

        await MenuItem.findByIdAndDelete(id);
       res.status(202).json('Menu Item deleted Succesfully')
    }catch(error){
        res.status(400).json('Error Deleting Item')
    }
}

const getAllMenuItems=async(req,res)=>{
    try{
        const menuItems=await MenuItem.find();
        res.status(200).json(menuItems);
    }catch(error){
        res.status(400).json('Error fetching menu items');
    }
}
const getMenuItemById=async(req,res)=>{
    try{
        const id=req.params.id;
        const menuItem=await MenuItem.findById(id);
        if(!menuItem){
            return res.status(400).json('Menu Item not found')
        }
        res.status(200).json(menuItem);
    }catch(error){
        res.status(400).json('Error fetching menu item');
    }
}
const getMenuItemByCategory=async(req,res)=>{
    try{
        const categoryId=req.params.categoryId;
        const menuItems=await MenuItem.find({categoryId:categoryId});
        res.status(200).json(menuItems);
    }catch(error){
        res.status(400).json('Error fetching menu items by category');
    }
}
const updateMenuItem=async(req,res)=>{
    try{
        const id=req.params.id;
        const updates=req.body;
        const image=req.file;
        const menuItem=await MenuItem.findById(id);
        if(!menuItem){
            return res.status(400).json('Menu Item not found')
        }
        if(image){
            await deleteFromCloudinary(menuItem.imagePublicId);
            const uploadResult=await uploadToCloudinary(image.buffer,'menu_items');
            updates.imageUrl=uploadResult.secure_url;
            updates.imagePublicId=uploadResult.public_id;
        }
        const updatedMenuItem=await MenuItem.findByIdAndUpdate(id,updates,{new:true});
        res.status(200).json(updatedMenuItem);
    }catch(error){
        res.status(400).json('Error updating menu item');
    }
}

const searchMenuItems=async(req,res)=>{
    try{
        const query=req.query;
        const menuItems=await MenuItem.find({
            $or:[
                {title:{$regex:query.q,$options:'i'}},
                {description:{$regex:query.q,$options:'i'}}
            ]
        });
        res.status(200).json(menuItems);
    }catch(error){
        res.status(400).json('Search Failed')
    }
}

module.exports={createMenuItem,deleteMenuItem,getAllMenuItems,getMenuItemById,getMenuItemByCategory,updateMenuItem,searchMenuItems};