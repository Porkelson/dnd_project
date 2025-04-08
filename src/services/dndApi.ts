const BASE_URL = 'https://www.dnd5eapi.co/api';

export interface DndApiResponse<T> {
  count: number;
  results: T[];
}

export interface ApiReference {
  index: string;
  name: string;
  url: string;
}

export interface Race extends ApiReference {
  speed: number;
  ability_bonuses: {
    ability_score: ApiReference;
    bonus: number;
  }[];
  alignment: string;
  age: string;
  size: string;
  size_description: string;
  starting_proficiencies: ApiReference[];
  languages: ApiReference[];
  language_desc: string;
  traits: ApiReference[];
  subraces: ApiReference[];
}

export interface Class extends ApiReference {
  hit_die: number;
  proficiency_choices: {
    choose: number;
    type: string;
    from: ApiReference[];
  }[];
  proficiencies: ApiReference[];
  saving_throws: ApiReference[];
  starting_equipment: {
    equipment: ApiReference;
    quantity: number;
  }[];
  starting_equipment_options: {
    choose: number;
    type: string;
    from: {
      equipment_category: ApiReference;
      quantity: number;
    }[];
  }[];
  class_levels: string;
  multi_classing: {
    prerequisites: {
      ability_score: ApiReference;
      minimum_score: number;
    }[];
    proficiencies: ApiReference[];
  };
  subclasses: ApiReference[];
  spellcasting?: {
    level: number;
    spellcasting_ability: ApiReference;
    info: {
      name: string;
      desc: string[];
    }[];
  };
}

export interface Spell extends ApiReference {
  desc: string[];
  higher_level: string[];
  range: string;
  components: string[];
  material: string;
  ritual: boolean;
  duration: string;
  concentration: boolean;
  casting_time: string;
  level: number;
  attack_type: string;
  damage: {
    damage_type: ApiReference;
    damage_at_character_level: {
      [key: string]: string;
    };
  };
  school: ApiReference;
  classes: ApiReference[];
  subclasses: ApiReference[];
}

export interface Equipment extends ApiReference {
  equipment_category: ApiReference;
  cost: {
    quantity: number;
    unit: string;
  };
  weight: number;
  desc: string[];
  properties: ApiReference[];
  category_range: string;
  range: {
    normal: number;
    long: number | null;
  };
  throw_range: {
    normal: number;
    long: number;
  };
  two_handed_damage: {
    damage_dice: string;
    damage_type: ApiReference;
  };
  armor_class: {
    base: number;
    dex_bonus: boolean;
    max_bonus: number | null;
  };
  str_minimum: number;
  stealth_disadvantage: boolean;
  damage: {
    damage_dice: string;
    damage_type: ApiReference;
  };
  weapon_range: string;
}

export interface Background extends ApiReference {
  desc: string[];
  starting_proficiencies: ApiReference[];
  starting_equipment: {
    equipment: ApiReference;
    quantity: number;
  }[];
  starting_equipment_options: {
    choose: number;
    type: string;
    from: {
      equipment_category: ApiReference;
      quantity: number;
    }[];
  }[];
  feature: {
    desc: string[];
    name: string;
  };
  personality_traits: {
    choose: number;
    type: string;
    from: string[];
  };
  ideals: {
    choose: number;
    type: string;
    from: {
      desc: string;
      alignments: ApiReference[];
    }[];
  };
  bonds: {
    choose: number;
    type: string;
    from: string[];
  };
  flaws: {
    choose: number;
    type: string;
    from: string[];
  };
}

export interface Feat extends ApiReference {
  desc: string[];
  prerequisites: {
    ability_score: ApiReference;
    minimum_score: number;
  }[];
}

export interface Proficiency extends ApiReference {
  type: string;
  classes: ApiReference[];
  races: ApiReference[];
  reference: ApiReference;
}

class DndApiService {
  async getRaces(): Promise<DndApiResponse<ApiReference>> {
    const response = await fetch(`${BASE_URL}/races`);
    return response.json();
  }

  async getRace(index: string): Promise<Race> {
    const response = await fetch(`${BASE_URL}/races/${index}`);
    return response.json();
  }

  async getClasses(): Promise<DndApiResponse<ApiReference>> {
    const response = await fetch(`${BASE_URL}/classes`);
    return response.json();
  }

  async getClass(index: string): Promise<Class> {
    const response = await fetch(`${BASE_URL}/classes/${index}`);
    return response.json();
  }

  async getSpells(): Promise<DndApiResponse<ApiReference>> {
    const response = await fetch(`${BASE_URL}/spells`);
    return response.json();
  }

  async getSpell(index: string): Promise<Spell> {
    const response = await fetch(`${BASE_URL}/spells/${index}`);
    return response.json();
  }

  async getMonsters(): Promise<DndApiResponse<ApiReference>> {
    const response = await fetch(`${BASE_URL}/monsters`);
    return response.json();
  }

  async getMonster(index: string): Promise<any> {
    const response = await fetch(`${BASE_URL}/monsters/${index}`);
    return response.json();
  }

  async getEquipment(): Promise<DndApiResponse<ApiReference>> {
    const response = await fetch(`${BASE_URL}/equipment`);
    return response.json();
  }

  async getEquipmentItem(index: string): Promise<Equipment> {
    const response = await fetch(`${BASE_URL}/equipment/${index}`);
    return response.json();
  }

  async getEquipmentCategories(): Promise<DndApiResponse<ApiReference>> {
    const response = await fetch(`${BASE_URL}/equipment-categories`);
    return response.json();
  }

  async getEquipmentCategory(index: string): Promise<any> {
    const response = await fetch(`${BASE_URL}/equipment-categories/${index}`);
    return response.json();
  }

  async getBackgrounds(): Promise<DndApiResponse<ApiReference>> {
    const response = await fetch(`${BASE_URL}/backgrounds`);
    return response.json();
  }

  async getBackground(index: string): Promise<Background> {
    const response = await fetch(`${BASE_URL}/backgrounds/${index}`);
    return response.json();
  }

  async getFeats(): Promise<DndApiResponse<ApiReference>> {
    const response = await fetch(`${BASE_URL}/feats`);
    return response.json();
  }

  async getFeat(index: string): Promise<Feat> {
    const response = await fetch(`${BASE_URL}/feats/${index}`);
    return response.json();
  }

  async getProficiencies(): Promise<DndApiResponse<ApiReference>> {
    const response = await fetch(`${BASE_URL}/proficiencies`);
    return response.json();
  }

  async getProficiency(index: string): Promise<Proficiency> {
    const response = await fetch(`${BASE_URL}/proficiencies/${index}`);
    return response.json();
  }

  async getSkills(): Promise<DndApiResponse<ApiReference>> {
    const response = await fetch(`${BASE_URL}/skills`);
    return response.json();
  }

  async getSkill(index: string): Promise<any> {
    const response = await fetch(`${BASE_URL}/skills/${index}`);
    return response.json();
  }

  async getLanguages(): Promise<DndApiResponse<ApiReference>> {
    const response = await fetch(`${BASE_URL}/languages`);
    return response.json();
  }

  async getLanguage(index: string): Promise<any> {
    const response = await fetch(`${BASE_URL}/languages/${index}`);
    return response.json();
  }

  async getTraits(): Promise<DndApiResponse<ApiReference>> {
    const response = await fetch(`${BASE_URL}/traits`);
    return response.json();
  }

  async getTrait(index: string): Promise<any> {
    const response = await fetch(`${BASE_URL}/traits/${index}`);
    return response.json();
  }
}

export const dndApi = new DndApiService(); 