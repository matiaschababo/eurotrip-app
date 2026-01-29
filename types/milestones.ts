export type MilestoneCategory = 'Transporte' | 'Hospedaje' | 'Actividad' | 'Documentación' | 'General';

export interface MilestoneItem {
    id: string;
    title: string;
    description?: string;
    category: MilestoneCategory;
    completed: boolean;
    dueDate?: string; // Optional: could be linked to the schedule date
    city?: string; // To group by city if needed
}

export interface MilestoneState {
    items: MilestoneItem[];
}
