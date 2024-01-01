import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
	Bounds,
	useBounds,
	OrbitControls,
	ContactShadows,
	Line,
} from "@react-three/drei";
import { data } from "./input.data";

const parseNums = (line: string, sep: string) =>
	line.split(sep).map((n) => parseInt(n));

const parseLine = (line: string, i: number) => {
	const parts = line.split(" @ ");
	const coords = parseNums(parts[0]!, ", ") as [number, number, number];
	const velocities = parseNums(parts[1]!, ", ") as [number, number, number];
	return { coords, velocities, index: i };
};

const DT = 1_000_000_000_000;

const objs = data
	.trim()
	.split("\n")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseLine);

const SelectToZoom: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const api = useBounds();
	return (
		<group
			onClick={(e) => (
				e.stopPropagation(), e.delta <= 2 && api.refresh(e.object).fit()
			)}
			onPointerMissed={(e) => e.button === 0 && api.refresh().fit()}
		>
			{children}
		</group>
	);
};

function App() {
	return (
		<Canvas camera={{ position: [0, -10, 80], fov: 50 }} dpr={[1, 2]}>
			<spotLight
				position={[-100, -100, -100]}
				intensity={0.2}
				angle={0.3}
				penumbra={1}
			/>
			<hemisphereLight
				color="white"
				groundColor="#ff0f00"
				position={[-7, 25, 13]}
				intensity={1}
			/>
			<Suspense fallback={null}>
				<Bounds fit clip observe margin={1.2}>
					<SelectToZoom>
						{objs.map((o, i) => (
							<Line
								key={i}
								points={[
									o.coords,
									[
										o.coords[0] + o.velocities[0] * DT,
										o.coords[1] + o.velocities[1] * DT,
										o.coords[2] + o.velocities[2] * DT,
									],
								]}
								color="blue"
								lineWidth={5}
							/>
						))}
					</SelectToZoom>
				</Bounds>
				<ContactShadows
					rotation-x={Math.PI / 2}
					position={[0, -35, 0]}
					opacity={0.2}
					width={200}
					height={200}
					blur={1}
					far={50}
				/>
			</Suspense>
			<OrbitControls
				makeDefault
				minPolarAngle={0}
				maxPolarAngle={Math.PI / 1.75}
			/>
		</Canvas>
	);
}

export default App;
