export class Keyword {
	public value: string;
}

export class Product {
	public itemName: string;
	public itemCategory: string;
	public itemId: string;
	public keywords: Keyword[];
	public condition: string;
	public salePrice: number;
	public quantity: number;
}