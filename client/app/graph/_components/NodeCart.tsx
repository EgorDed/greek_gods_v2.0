import React from 'react';
import {useGraphContext} from "@/app/graph/_components/GraphContextWrappper";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";

const NodeCart = () => {
    const {selectedNode, setSelectedNode} = useGraphContext();

    if (!selectedNode) {
        return (
            <div className="h-full w-full flex items-center justify-center text-white/40 italic p-6 text-center">
                Выберите персонажа на графе, чтобы увидеть подробности
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col text-white overflow-y-auto custom-scrollbar bg-black/60 backdrop-blur-xl">
            {/* Header */}
            <div className="p-4 flex justify-between items-center border-b border-white/10">
                <h2 className="text-2xl font-bold tracking-tighter uppercase">{selectedNode.title}</h2>
                <MoreHorizontal className="size-5 text-white/60 cursor-pointer hover:text-white" />
            </div>

            {/* Image Section */}
            <div className="p-4">
                <div className="aspect-[4/3] rounded-xl overflow-hidden border border-white/20 bg-gradient-to-br from-purple-900/40 to-black relative shadow-2xl shadow-purple-500/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                        {selectedNode.avatar ? (
                            <img
                                src={`/avatars/${selectedNode.avatar}`}
                                alt={selectedNode.title}
                                className="w-full h-full object-cover opacity-90"
                            />
                        ) : (
                            <img
                                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${selectedNode.code}`}
                                alt={selectedNode.title}
                                className="w-3/4 h-3/4 opacity-80"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="px-4 space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Принадлежность</span>
                        <span className="text-purple-300 font-medium">{selectedNode.type}</span>
                    </div>
                    {/*<div className="flex justify-between text-sm">*/}
                    {/*    <span className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Updated</span>*/}
                    {/*    <span className="text-white/60 text-[11px]">{}</span>*/}
                    {/*</div>*/}
                </div>

                <div className="pt-4 border-t border-white/10">
                    <p className="text-sm leading-relaxed text-gray-300 font-light italic">
                        {selectedNode.description || selectedNode.short_description}
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-6 pb-8">
                    <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-[10px] px-1 h-9 uppercase tracking-tighter">
                        Read More
                    </Button>
                    <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-[10px] px-1 h-9 uppercase tracking-tighter">
                        Related
                    </Button>
                    <Button 
                        onClick={() => setSelectedNode(null)}
                        variant="outline" 
                        className="bg-purple-900/40 border-purple-500/50 hover:bg-purple-800/60 text-[10px] px-1 h-9 uppercase tracking-tighter"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default NodeCart;