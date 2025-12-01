const Category=require('../model/Categories');

const getAllCategories=async(req,res)=>{
    try{
        const categories=await Category.find();
        res.status(200).json(categories);
    }catch(error){
        res.status(400).json('Error fetching categories');
    }
}
const getCategoryById=async(req,res)=>{
    try{
        const id=req.params.id;
        const category=await Category.findById(id);
        if(!category){
            return res.status(400).json('Category not found')
        }
        res.status(200).json(category);
    }catch(error){
        res.status(400).json('Error fetching category');
    }
}


const createCategory=async(req,res)=>{ 
    try{
        const newCategory=new Category(req.body);
        await newCategory.save();
        res.status(201).json(newCategory);
    }catch{
        res.status(400).json('Error creating category');
    }
}
const deleteCategory=async(req,res)=>{
    try{
        const id=req.params.id;
        const category=await Category.findById(id)
        if(!category){
            return res.status(400).json('Category not found')
        }
        await Category.findByIdAndDelete(id);
       res.status(202).json('Category deleted Succesfully')
    }catch(error){
        res.status(400).json('Error Deleting Category')
    }
}
module.exports={getAllCategories,getCategoryById,createCategory,deleteCategory};