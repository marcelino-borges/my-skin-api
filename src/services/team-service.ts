import { Request, Response } from "express";
import omit from "lodash.omit";
import team, { ITeamMember } from '../models/team-models';
import AppError, { INVALID_QUERY, NOT_CREATED, NO_TEAMMATES, TEAMMATE_ALREADY_EXIST, TEAMMATE_NOT_FOUND } from './../errors/app-error';

export const getAllMembers = async (_req: Request, res: Response, next: any) => {
    try {
        const found = await team.find();
        if(found && found.length > 0)
            return res.status(200).json(found);
        else
            return res.status(400).json(new AppError(NO_TEAMMATES));
    } catch(e: any) {
        return res.status(500).json(new AppError(e.message, 500));
    }
}

export const getMemberByName = async (req: Request, res: Response, next: any) => {
    try {
        const firstNameSearched: string = req.query.firstName as string;
        const lastNameSearched: string = req.query.lastName as string;

        if(!firstNameSearched && !lastNameSearched)
            return res.status(400).json(new AppError(INVALID_QUERY));

        let membersFound = await team.find({ $or: [ { firstName: firstNameSearched }, { lastName: lastNameSearched }]});

        if(membersFound && membersFound.length > 0)
            return res.status(200).json(membersFound);
        else
            return res.status(400).json(new AppError(TEAMMATE_NOT_FOUND));
    } catch(e: any) {
        return res.status(500).json(new AppError(e.message, 500));
    }
}

export const getMemberById = async (req: Request, res: Response, next: any) => {
    try {
        const idSearched = req.params.id as string;
        let memberFound = await team.findOne({ _id: idSearched });

        if(memberFound)
            return res.status(200).json(memberFound);
        else
            return res.status(400).json(new AppError(TEAMMATE_NOT_FOUND));
    } catch(e: any) {
        return res.status(500).json(new AppError(e.message, 500));
    }
}

export const getMemberByEmail = async (req: Request, res: Response, next: any) => {
    try {
        let memberFound = await team.findOne({ email: req.params.email });

        if(memberFound)
            return res.status(200).json(memberFound);
        else
            return res.status(400).json(new AppError(TEAMMATE_NOT_FOUND));
    } catch(e: any) {
        return res.status(500).json(new AppError(e.message, 500));
    }
}

export const createTeammate = async (req: Request, res: Response, next: any) => {
    try {
        const newTeammate: ITeamMember = req.body;

        const foundTeammate = await team.findOne({ email: newTeammate.email });

        if(foundTeammate)
            return res.status(400).json(new AppError(TEAMMATE_ALREADY_EXIST));

        const docCreated = await team.create(newTeammate);

        if(docCreated)
            return res.status(201).json(newTeammate);
        else
            return res.status(400).json(new AppError(NOT_CREATED));
    } catch(e: any) {
        return res.status(500).json(new AppError(e.message, 500));
    }
}

export const updateTeammate = async (req: Request, res: Response, next: any) => {
    try {
        const teammate: ITeamMember = req.body;
        const withoutId = omit(teammate, "_id");
        const found = await team.findOneAndReplace({ 
            $or: [{ _id: teammate._id }, { email: teammate.email }]}, 
            withoutId,
            { new: true } //Returns the updated json from database
        );

        if(found)
            return res.status(200).json(found);
        else
            return res.status(400).json(new AppError(TEAMMATE_NOT_FOUND));
    } catch(e: any) {
        return res.status(500).json(new AppError(e.message, 500));
    }
}

export const deleteTeammate = async (req: Request, res: Response, next: any) => {
    try {
        const idSearched: string | undefined = req.query.id as string;
        const emailSearched: string = req.query.email as string;
        let found;

        if(idSearched)
            found = await team.findOneAndDelete({ _id: idSearched });
        else if(emailSearched)
            found = await team.findOneAndDelete({ email: emailSearched });

        if(found)
            return res.status(200).json(found);
        else
            return res.status(400).json(new AppError(TEAMMATE_NOT_FOUND));
    } catch(e: any) {
        return res.status(500).json(new AppError(e.message, 500));
    }
}