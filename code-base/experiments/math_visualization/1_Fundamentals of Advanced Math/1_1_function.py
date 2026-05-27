"""
Function Properties Visualization - Fundamentals of Advanced Math
===============================================================

This script generates visualizations for different function properties:
1. Even-Odd Property (2 functions)
2. Symmetry (1 function)
3. Monotonicity (2 functions)

Usage:
    python 1_1_function.py --type even --a 1.0 --c 0.0
    python 1_1_function.py --type odd --a 1.0 --b 0.0
    python 1_1_function.py --type symmetry --a 1.0 --h 0.0 --k 0.0
    python 1_1_function.py --type increasing --a 1.0 --b 1.0
    python 1_1_function.py --type decreasing --a 1.0 --b 1.0
"""

import argparse
import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path
from typing import Callable, Tuple


def create_even_function(a: float = 1.0, b: float = 0.0, c: float = 0.0) -> Tuple[Callable, str]:
    """
    Create an even function: f(x) = ax² + c (symmetric about y-axis)
    
    Args:
        a: Coefficient for x² term
        b: Coefficient for x term (should be 0 for even function)
        c: Constant term
    
    Returns:
        Tuple of (function, description)
    """
    def f(x):
        return a * x**2 + c
    
    description = f"Even Function: f(x) = {a}x² + {c}\nProperty: f(-x) = f(x), symmetric about y-axis"
    return f, description


def create_odd_function(a: float = 1.0, b: float = 0.0) -> Tuple[Callable, str]:
    """
    Create an odd function: f(x) = ax³ + bx (symmetric about origin)
    
    Args:
        a: Coefficient for x³ term
        b: Coefficient for x term
    
    Returns:
        Tuple of (function, description)
    """
    def f(x):
        return a * x**3 + b * x
    
    description = f"Odd Function: f(x) = {a}x³ + {b}x\nProperty: f(-x) = -f(x), symmetric about origin"
    return f, description


def create_symmetry_function(a: float = 1.0, h: float = 0.0, k: float = 0.0) -> Tuple[Callable, str]:
    """
    Create a symmetric function: f(x) = a|x - h| + k (symmetric about x=h)
    
    Args:
        a: Scaling coefficient
        h: X-coordinate of symmetry axis
        k: Y-coordinate of vertex
    
    Returns:
        Tuple of (function, description)
    """
    def f(x):
        return a * np.abs(x - h) + k
    
    description = f"Symmetric Function: f(x) = {a}|x - {h}| + {k}\nProperty: symmetric about x = {h}"
    return f, description


def create_increasing_function(a: float = 1.0, b: float = 1.0) -> Tuple[Callable, str]:
    """
    Create a monotonically increasing function: f(x) = ae^(bx)
    
    Args:
        a: Scaling coefficient (must be > 0)
        b: Growth rate (must be > 0)
    
    Returns:
        Tuple of (function, description)
    """
    if a <= 0 or b <= 0:
        raise ValueError("For increasing function, a and b must be positive")
    
    def f(x):
        return a * np.exp(b * x)
    
    description = f"Monotonically Increasing: f(x) = {a}e^({b}x)\nProperty: always increasing (f'(x) > 0)"
    return f, description


def create_decreasing_function(a: float = 1.0, b: float = 1.0) -> Tuple[Callable, str]:
    """
    Create a monotonically decreasing function: f(x) = ae^(-bx)
    
    Args:
        a: Scaling coefficient (must be > 0)
        b: Decay rate (must be > 0)
    
    Returns:
        Tuple of (function, description)
    """
    if a <= 0 or b <= 0:
        raise ValueError("For decreasing function, a and b must be positive")
    
    def f(x):
        return a * np.exp(-b * x)
    
    description = f"Monotonically Decreasing: f(x) = {a}e^(-{b}x)\nProperty: always decreasing (f'(x) < 0)"
    return f, description


def plot_function(
    func: Callable,
    description: str,
    x_min: float = -10,
    x_max: float = 10,
    output_path: str = None,
    show_grid: bool = True,
    title: str = "Function Visualization"
):
    """
    Plot the function with enhanced visualization
    
    Args:
        func: The function to plot
        description: Description of the function
        x_min: Minimum x value
        x_max: Maximum x value
        output_path: Path to save the image
        show_grid: Whether to show grid
        title: Plot title
    """
    # Generate data points
    x = np.linspace(x_min, x_max, 1000)
    y = func(x)
    
    # Create figure
    fig, ax = plt.subplots(figsize=(12, 8))
    
    # Plot the function
    ax.plot(x, y, 'b-', linewidth=2, label='f(x)')
    
    # Add axes lines
    ax.axhline(y=0, color='k', linewidth=1)
    ax.axvline(x=0, color='k', linewidth=1)
    
    # Add grid
    if show_grid:
        ax.grid(True, alpha=0.3)
    
    # Add title and labels
    ax.set_title(title, fontsize=16, fontweight='bold')
    ax.set_xlabel('x', fontsize=14)
    ax.set_ylabel('f(x)', fontsize=14)
    ax.legend(fontsize=12)
    
    # Add description text box
    props = dict(boxstyle='round', facecolor='wheat', alpha=0.8)
    ax.text(0.02, 0.98, description, transform=ax.transAxes, 
            fontsize=11, verticalalignment='top', bbox=props)
    
    # Set limits
    ax.set_xlim(x_min, x_max)
    
    # Auto-scale y-axis with some padding
    y_range = np.max(y) - np.min(y)
    y_padding = y_range * 0.1
    ax.set_ylim(np.min(y) - y_padding, np.max(y) + y_padding)
    
    plt.tight_layout()
    
    # Save or show
    if output_path:
        plt.savefig(output_path, dpi=150, bbox_inches='tight')
        print(f"✓ Image saved to: {output_path}")
    else:
        plt.show()
    
    plt.close()


def main():
    parser = argparse.ArgumentParser(description='Generate function property visualizations')
    parser.add_argument('--type', type=str, required=True, 
                        choices=['even', 'odd', 'symmetry', 'increasing', 'decreasing'],
                        help='Type of function to visualize')
    parser.add_argument('--a', type=float, default=1.0, help='Parameter a')
    parser.add_argument('--b', type=float, default=0.0, help='Parameter b')
    parser.add_argument('--c', type=float, default=0.0, help='Parameter c')
    parser.add_argument('--h', type=float, default=0.0, help='Parameter h (for symmetry)')
    parser.add_argument('--k', type=float, default=0.0, help='Parameter k (for symmetry)')
    parser.add_argument('--x-min', type=float, default=-10.0, help='Minimum x value')
    parser.add_argument('--x-max', type=float, default=10.0, help='Maximum x value')
    parser.add_argument('--output', type=str, default=None, help='Output image path')
    
    args = parser.parse_args()
    
    # Determine output directory
    if args.output is None:
        output_dir = Path(__file__).parent.parent.parent.parent / 'generated-images' / 'mathematics' / '1_Fundamentals of Advanced Math'
        output_dir.mkdir(parents=True, exist_ok=True)
        args.output = str(output_dir / f'{args.type}_function.png')
    
    # Create and plot function based on type
    try:
        if args.type == 'even':
            func, desc = create_even_function(args.a, args.b, args.c)
            title = "Even Function (f(-x) = f(x))"
        elif args.type == 'odd':
            func, desc = create_odd_function(args.a, args.b)
            title = "Odd Function (f(-x) = -f(x))"
        elif args.type == 'symmetry':
            func, desc = create_symmetry_function(args.a, args.h, args.k)
            title = "Symmetric Function"
        elif args.type == 'increasing':
            func, desc = create_increasing_function(args.a, args.b)
            title = "Monotonically Increasing Function"
        elif args.type == 'decreasing':
            func, desc = create_decreasing_function(args.a, args.b)
            title = "Monotonically Decreasing Function"
        else:
            raise ValueError(f"Unknown function type: {args.type}")
        
        # Plot the function
        plot_function(
            func, 
            desc, 
            x_min=args.x_min, 
            x_max=args.x_max,
            output_path=args.output,
            title=title
        )
        
        print(f"\n✓ Successfully generated {args.type} function visualization!")
        print(f"  Parameters: a={args.a}, b={args.b}, c={args.c}, h={args.h}, k={args.k}")
        
    except Exception as e:
        print(f" Error: {str(e)}")
        raise


if __name__ == '__main__':
    main()
