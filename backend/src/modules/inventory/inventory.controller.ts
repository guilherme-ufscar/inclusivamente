import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const resolveStudentId = async (id: string): Promise<string> => {
    if (!id) return id;
    const user = await prisma.user.findUnique({ where: { id } });
    if (user && user.role === 'student') {
        const student = await prisma.student.findFirst({ where: { user_id: id } });
        return student ? student.id : id;
    }
    return id;
};

export const syncInventory = async (req: Request, res: Response) => {
    try {
        let { student_id, items, houseItems } = req.body;

        if (!student_id) {
            return res.status(400).json({ success: false, message: 'student_id is required' });
        }

        const finalStudentId = await resolveStudentId(student_id);

        await prisma.$transaction(async (tx) => {
            // Delete all current inventory
            if (items !== undefined) {
                await tx.inventoryItem.deleteMany({ where: { student_id: finalStudentId } });

                if (Array.isArray(items) && items.length > 0) {
                    await tx.inventoryItem.createMany({
                        data: items.map((item: any) => ({
                            student_id: finalStudentId,
                            soid: String(item.soid),
                            item_type: item.itemtype || item.itemType || 'default',
                            amount: Number(item.amount || 0)
                        }))
                    });
                }
            }

            // Delete all current house items
            if (houseItems !== undefined) {
                await tx.houseItem.deleteMany({ where: { student_id: finalStudentId } });

                if (Array.isArray(houseItems) && houseItems.length > 0) {
                    await tx.houseItem.createMany({
                        data: houseItems.map((hi: any) => {
                            const posX = hi.Pos?.x ?? hi.Pos?.X ?? hi.pos?.x ?? hi.pos?.X ?? 0;
                            const posY = hi.Pos?.y ?? hi.Pos?.Y ?? hi.pos?.y ?? hi.pos?.Y ?? 0;
                            const posZ = hi.Pos?.z ?? hi.Pos?.Z ?? hi.pos?.z ?? hi.pos?.Z ?? 0;

                            return {
                                student_id: finalStudentId,
                                soid: String(hi.soid),
                                rotate: Boolean(hi.Rotate || hi.rotate || false),
                                position_x: Number(posX),
                                position_y: Number(posY),
                                position_z: Number(posZ),
                            };
                        })
                    });
                }
            }
        });

        return res.status(200).json({ success: true, message: 'Inventory synced successfully' });
    } catch (error) {
        console.error('Error syncing inventory:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getInventory = async (req: Request, res: Response) => {
    try {
        let { student_id } = req.params as any;

        if (!student_id) {
            return res.status(400).json({ success: false, message: 'Student ID is required' });
        }

        const finalStudentId = await resolveStudentId(student_id);

        const items = await prisma.inventoryItem.findMany({
            where: { student_id: finalStudentId }
        });

        const houseItems = await prisma.houseItem.findMany({
            where: { student_id: finalStudentId }
        });

        // Map back to the client expected format
        const formattedItems = items.map((item: any) => ({
            soid: item.soid,
            itemtype: item.item_type,
            amount: item.amount
        }));

        const formattedHouseItems = houseItems.map((hi: any) => ({
            soid: hi.soid,
            Rotate: hi.rotate,
            Pos: { x: hi.position_x, y: hi.position_y, z: hi.position_z }
        }));

        return res.status(200).json({
            success: true,
            data: {
                items: formattedItems,
                houseItems: formattedHouseItems
            }
        });
    } catch (error) {
        console.error('Error getting inventory:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
