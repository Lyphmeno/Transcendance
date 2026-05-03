export declare function isMember(chanId: number, memberId: number): Promise<boolean>;
export declare function isAdmin(chanId: number, memberId: number): Promise<boolean>;
export declare function isOwner(chanId: number, memberId: number): Promise<boolean>;
export declare function psswdMatch(chanId: number, password: string): Promise<boolean>;
export declare function isBanned(chanId: number, userId: number): Promise<boolean>;
export declare function isMuted(chanId: number, userId: number): Promise<boolean>;
